import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Search, Send, Plus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { ScrollArea } from '../components/ui/scroll-area'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Separator } from '../components/ui/separator'

const CHATS = [
    {
        id: 1,
        name: 'Support Bot',
        lastMessage: 'Sure, share the logs.',
        unread: 1,
        initials: 'SB',
        status: 'Online · Typing…',
    },
    {
        id: 2,
        name: 'Project Team',
        lastMessage: 'Standup at 10:30.',
        unread: 0,
        initials: 'PT',
        status: '3 members active',
    },
    {
        id: 3,
        name: 'Ananya',
        lastMessage: 'Lunch?',
        unread: 0,
        initials: 'AN',
        status: 'Last seen 1h ago',
    },
    {
        id: 4,
        name: 'Backend Squad',
        lastMessage: '500 on POST /tickets',
        unread: 3,
        initials: 'BE',
        status: '2 members active',
    },
]

function createInitialConversation(chatName) {
    return [
        {
            id: 1,
            author: 'assistant',
            message: `Hi! You are now connected to ${chatName}. How can I help you today?`,
            at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
    ]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:8080'

function createConversationId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID()
    }

    return `conv-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function getConversationId() {
    const storageKey = 'helpdesk_conversation_id'
    const existing = localStorage.getItem(storageKey)

    if (existing) {
        return existing
    }

    const created = createConversationId()
    localStorage.setItem(storageKey, created)
    return created
}

function getConversationIdForChat(chatId) {
    const key = `helpdesk_conversation_id_chat_${chatId}`
    const existing = localStorage.getItem(key)

    if (existing) {
        return existing
    }

    const created = createConversationId()
    localStorage.setItem(key, created)
    return created
}

function ChatList({ selectedChatId, onSelect }) {
    return (
        <>
            <div className="flex items-center gap-2 border-b p-3">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <Plus className="h-4 w-4" />
                </Button>
                <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search chats..."
                        className="h-8 rounded-full bg-background pl-9"
                    />
                </div>
            </div>

            <ScrollArea className="h-[calc(100%-60px)]">
                <div className="p-2">
                    {CHATS.map((chat) => {
                        const active = chat.id === selectedChatId
                        return (
                            <button
                                key={chat.id}
                                type="button"
                                onClick={() => onSelect(chat.id)}
                                className={`mb-1 flex w-full items-start gap-3 rounded-xl px-3 py-2 text-left transition ${
                                    active ? 'bg-secondary' : 'hover:bg-secondary/60'
                                }`}>
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{chat.initials}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="truncate text-sm font-medium">{chat.name}</p>
                                        {chat.unread > 0 ? (
                                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                                                {chat.unread}
                                            </span>
                                        ) : null}
                                    </div>
                                    <p className="truncate text-xs text-muted-foreground">{chat.lastMessage}</p>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </ScrollArea>
        </>
    )
}

function Chat() {
    const [selectedChatId, setSelectedChatId] = useState(CHATS[0].id)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    const [input, setInput] = useState('')
    const [conversationsByChat, setConversationsByChat] = useState(() =>
        CHATS.reduce((accumulator, chat) => {
            accumulator[chat.id] = createInitialConversation(chat.name)
            return accumulator
        }, {}),
    )
    const [sendingByChat, setSendingByChat] = useState({})
    const bottomAnchorRef = useRef(null)
    const nextIdByChatRef = useRef(
        CHATS.reduce((accumulator, chat) => {
            accumulator[chat.id] = 2
            return accumulator
        }, {}),
    )
    const conversationIdByChatRef = useRef(
        CHATS.reduce((accumulator, chat) => {
            accumulator[chat.id] = getConversationIdForChat(chat.id)
            return accumulator
        }, {}),
    )

    const activeChat = useMemo(
        () => CHATS.find((chat) => chat.id === selectedChatId) ?? CHATS[0],
        [selectedChatId],
    )
    const conversation = conversationsByChat[selectedChatId] ?? []
    const isSending = Boolean(sendingByChat[selectedChatId])

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId)
        setMobileSidebarOpen(false)
    }

    useEffect(() => {
        bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [conversation, selectedChatId])

    const sendWithStream = async (chatId, question, assistantMessageId) => {
        const response = await fetch(`${API_BASE_URL}/api/v1/helpdesk/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                ConversationId: conversationIdByChatRef.current[chatId],
            },
            body: question,
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        if (!response.body) {
            throw new Error('No response body from stream endpoint')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let done = false

        while (!done) {
            const { value, done: streamDone } = await reader.read()
            done = streamDone

            if (!value) {
                continue
            }

            const chunk = decoder.decode(value, { stream: !done })
            if (!chunk) {
                continue
            }

            setConversationsByChat((previous) => ({
                ...previous,
                [chatId]: (previous[chatId] ?? []).map((message) =>
                    message.id === assistantMessageId
                        ? { ...message, message: `${message.message}${chunk}` }
                        : message,
                ),
            }))
        }
    }

    const sendWithoutStream = async (chatId, question, assistantMessageId) => {
        const response = await fetch(`${API_BASE_URL}/api/v1/helpdesk`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                ConversationId: conversationIdByChatRef.current[chatId],
            },
            body: question,
        })

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }

        const text = await response.text()
        setConversationsByChat((previous) => ({
            ...previous,
            [chatId]: (previous[chatId] ?? []).map((message) =>
                message.id === assistantMessageId ? { ...message, message: text } : message,
            ),
        }))
    }

    const handleSend = async () => {
        const chatId = selectedChatId
        const question = input.trim()
        if (!question || isSending) {
            return
        }

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const userMessageId = nextIdByChatRef.current[chatId]++
        const assistantMessageId = nextIdByChatRef.current[chatId]++

        setConversationsByChat((previous) => ({
            ...previous,
            [chatId]: [
                ...(previous[chatId] ?? []),
                { id: userMessageId, author: 'user', message: question, at: now },
                { id: assistantMessageId, author: 'assistant', message: '', at: now },
            ],
        }))
        setInput('')
        setSendingByChat((previous) => ({ ...previous, [chatId]: true }))

        try {
            await sendWithStream(chatId, question, assistantMessageId)
        } catch (streamError) {
            try {
                await sendWithoutStream(chatId, question, assistantMessageId)
            } catch (fallbackError) {
                setConversationsByChat((previous) => ({
                    ...previous,
                    [chatId]: (previous[chatId] ?? []).map((message) =>
                        message.id === assistantMessageId
                            ? {
                                  ...message,
                                  message:
                                      'Unable to reach backend. Please ensure Spring backend is running and CORS allows this frontend origin.',
                              }
                            : message,
                    ),
                }))
                console.error('Streaming and fallback call failed', { streamError, fallbackError })
            }
        } finally {
            setSendingByChat((previous) => ({ ...previous, [chatId]: false }))
        }
    }

    const handleInputKeyDown = async (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            await handleSend()
        }
    }

  return (
        <div className="h-[100dvh] bg-muted/20 p-0 md:p-4">
            <div className="mx-auto h-full max-w-6xl overflow-hidden border bg-background md:h-[calc(100dvh-2rem)] md:rounded-2xl">
                <div className="grid h-full grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)]">
                    <aside className="hidden border-r md:block">
                        <ChatList selectedChatId={selectedChatId} onSelect={handleSelectChat} />
                    </aside>

                    {mobileSidebarOpen ? (
                        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileSidebarOpen(false)}>
                            <aside
                                className="h-full w-[82%] max-w-sm bg-background shadow-2xl"
                                onClick={(event) => event.stopPropagation()}>
                                <ChatList selectedChatId={selectedChatId} onSelect={handleSelectChat} />
                            </aside>
                        </div>
                    ) : null}

                    <section className="flex h-full min-h-0 flex-col overflow-hidden">
                        <header className="shrink-0 flex items-center justify-between border-b p-3 md:px-5">
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 md:hidden"
                                    onClick={() => setMobileSidebarOpen(true)}>
                                    <Plus className="h-4 w-4" />
                                </Button>

                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>{activeChat.initials}</AvatarFallback>
                                </Avatar>

                                <div>
                                    <p className="text-sm font-semibold">{activeChat.name}</p>
                                    <p className="text-xs text-muted-foreground">{activeChat.status}</p>
                                </div>
                            </div>

                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <Search className="h-4 w-4" />
                            </Button>
                        </header>

                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <div className="space-y-5 p-4 pb-2 md:p-6 md:pb-3">
                                {conversation.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className="max-w-[80%] md:max-w-[60%]">
                                            <div
                                                className={`rounded-2xl px-4 py-2 text-sm ${
                                                    message.author === 'user'
                                                        ? 'rounded-br-md bg-primary text-primary-foreground'
                                                        : 'rounded-bl-md bg-secondary text-secondary-foreground'
                                                }`}>
                                                {message.message}
                                            </div>
                                            <span className="mt-1 block text-xs text-muted-foreground">{message.at}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={bottomAnchorRef} />
                            </div>
                        </div>

                        <Separator className="shrink-0" />
                        <div className="shrink-0 bg-background p-3 md:p-4">
                            <div className="flex items-center gap-2 rounded-full border bg-background p-1">
                                <Input
                                    placeholder="Write a message..."
                                    value={input}
                                    onChange={(event) => setInput(event.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    disabled={isSending}
                                    className="h-9 border-0 shadow-none focus-visible:ring-0"
                                />
                                <Button
                                    size="sm"
                                    className="rounded-full px-4"
                                    onClick={handleSend}
                                    disabled={!input.trim() || isSending}>
                                    <Send className="mr-1 h-4 w-4" />
                                    {isSending ? 'Sending...' : 'Send'}
                                </Button>
                            </div>
                        </div>
                    </section>
        </div>
            </div>
    </div>
  )
}

export default Chat

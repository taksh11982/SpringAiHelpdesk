import { Bot } from 'lucide-react'
import React from 'react'
import { Button } from '../components/ui/button'
import { useNavigate } from 'react-router'

function ChatHome() {
    const navigate= useNavigate();
    const handleChatStartClick=()=>{
        //custom logic can be added before navigation
        navigate("/chat");
    }
  return (
    <div className='h-screen w-screen flex justify-center items-center flex-col gap-5'>
        <Bot className='w-16 h-16 text-gray-500 mt-4' />
      <h1 className='text-4xl fond-bold'>Welcome to the Helpdesk system.</h1>
      <Button className={'cursor-pointer'} variant='outline' onClick={handleChatStartClick}>
        Start Getting Help
      </Button>
    </div>
  )
}

export default ChatHome

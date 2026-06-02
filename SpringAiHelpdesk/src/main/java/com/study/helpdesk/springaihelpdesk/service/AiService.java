package com.study.helpdesk.springaihelpdesk.service;

import com.study.helpdesk.springaihelpdesk.tools.EmailTool;
import com.study.helpdesk.springaihelpdesk.tools.TicketDatabaseTool;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class AiService {
    private final ChatClient chatClient;
    private final TicketDatabaseTool ticketDatabaseTool;
    private final EmailTool emailTool;
    @Value("classpath:/helpdesk-system.st")
    private Resource systemPromptResouce;
    public String getResponseFromAssistant(String q,String conversationId){
        return this.chatClient
                .prompt()
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID,conversationId))
                .tools(ticketDatabaseTool, emailTool)
                .system(systemPromptResouce)
                .user(q)
                .call()
                .content();
    }
    public Flux<String> streamResponseFromAssistant(String q, String conversationId){
        return this.chatClient
                .prompt()
                .advisors(advisorSpec -> advisorSpec.param(ChatMemory.CONVERSATION_ID,conversationId))
                .tools(ticketDatabaseTool, emailTool)
                .system(systemPromptResouce)
                .user(q)
                .stream()
                .content();
    }

}

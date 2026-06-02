package com.study.helpdesk.springaihelpdesk.controller;


import com.study.helpdesk.springaihelpdesk.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/v1/helpdesk")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {
    private final AiService aiService;
    @PostMapping
    public ResponseEntity<String> getResponse(@RequestBody String requestBody, @RequestHeader("ConversationId")String conversationId) {
        return ResponseEntity.ok(aiService.getResponseFromAssistant(requestBody,conversationId));
    }

    @PostMapping("/stream")
    public Flux<String> streamPublisher(@RequestBody String requestBody, @RequestHeader("ConversationId")String conversationId) {
        return this.aiService.streamResponseFromAssistant(requestBody,conversationId);
    }
}

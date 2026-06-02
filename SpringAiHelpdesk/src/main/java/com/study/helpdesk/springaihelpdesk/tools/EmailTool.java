package com.study.helpdesk.springaihelpdesk.tools;

import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

@Component
public class EmailTool {
    @Tool(description = "this tool helps to send email to support team regarding new ticket")
    public void sendEmailToSupportTeam(@ToolParam(description = "email id is associated with ticket for contact information") String email,@ToolParam(description = "short description of ticket summary") String description){

    }
}

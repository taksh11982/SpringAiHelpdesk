package com.study.helpdesk.springaihelpdesk.tools;

import com.study.helpdesk.springaihelpdesk.entities.Ticket;
import com.study.helpdesk.springaihelpdesk.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicketDatabaseTool {
    private final TicketService ticketService;
    //create ticket tools
    @Tool(description = "This tool helps to create new ticket in database.")
    public Ticket createTicketTool(@ToolParam(description = "ticket fields required to create new ticket.") Ticket ticket) {
        Ticket ticket2 = null;
        try {
            System.out.println("Creating a new ticket...");
            System.out.println("Ticket:" + ticket);
            ticket2 = ticketService.createTicket(ticket);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ticket2;
    }
    @Tool(description = "this tool helps to get ticket by username.")
    public Ticket getTicketByEmailId(@ToolParam(description = "email whoose ticket is required.") String email) {
        return ticketService.getTicketByEmailId(email);
    }
    @Tool(description = "This tool helps to update the ticket.")
    public Ticket updateTicket(@ToolParam(description = "new ticket detail with old ticketid.") Ticket ticket) {
        return  ticketService.updateTicket(ticket);
    }

    //get current datetime
    @Tool(description = "this tool helps to get current system time.")
    public String getCurrentTime(){
        return String.valueOf(System.currentTimeMillis());
    }
}


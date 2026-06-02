package com.study.helpdesk.springaihelpdesk.service;

import com.study.helpdesk.springaihelpdesk.entities.Ticket;
import com.study.helpdesk.springaihelpdesk.repository.TicketRepo;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepo ticketRepo;
    @Transactional
    public Ticket createTicket(Ticket ticket) {
        ticket.setTicketId(null);
        return ticketRepo.save(ticket);
    }
    public Ticket getTicketById(Long id) {
        return ticketRepo.findById(id).orElse(null);
    }
    public  Ticket getTicketByEmailId(String email) {
        return ticketRepo.findByEmail(email).orElse(null);
    }

    //update ticket
    @Transactional
    public Ticket  updateTicket(Ticket ticket) {
        return  ticketRepo.save(ticket);
    }
    //get ticket by username
    //delete ticket
}

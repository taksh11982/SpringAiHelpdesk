package com.study.helpdesk.springaihelpdesk.repository;

import com.study.helpdesk.springaihelpdesk.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface TicketRepo extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketId(Long id);

    Optional<Ticket> findByEmail(String email);
}

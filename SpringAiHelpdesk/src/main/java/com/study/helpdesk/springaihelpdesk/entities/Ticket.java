package com.study.helpdesk.springaihelpdesk.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "help_desk_ticket")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ticketId;
    @Lob
    private String summary;
    @Enumerated(EnumType.STRING)
    private Priority priority;
    private String category;
    @Column(unique = true)
    private String email;
    private LocalDateTime createdon;
    private LocalDateTime updatedon;
    @Enumerated(EnumType.STRING)
    private Status status;
    @PrePersist
    void preSave() {
        if(this.createdon == null) {
            this.createdon = LocalDateTime.now();
        }
        this.updatedon = LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        this.updatedon = LocalDateTime.now();
    }
}

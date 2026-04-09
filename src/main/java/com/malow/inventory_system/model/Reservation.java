package com.malow.inventory_system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Reservation {
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne // Multiple reservations
    @JoinColumn(name = "equipment_id") // Foreign Key
    private Equipment equipment;
}

package com.malow.inventory_system.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.malow.inventory_system.model.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Thank you Spring Data JPA for writing the SQL commands
}

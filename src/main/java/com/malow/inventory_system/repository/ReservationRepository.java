package com.malow.inventory_system.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.malow.inventory_system.model.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Thank you Spring Data JPA for writing the SQL commands
    
    @Query("SELECT MAX(r.endDate) FROM Reservation r WHERE r.equipment.id = :equipmentId")
    LocalDate findLatestReturnDate(Long equipmentId);

    List<Reservation> findAllByEndDateBefore(LocalDate date);
}

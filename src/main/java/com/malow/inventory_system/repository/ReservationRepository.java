package com.malow.inventory_system.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.malow.inventory_system.model.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Thank you Spring Data JPA for writing the SQL commands
    
    @Query("SELECT MIN(r.endDate) FROM Reservation r " +
       "WHERE r.equipment.id = :equipmentId " +
       "AND r.startDate <= CURRENT_DATE " + 
       "AND r.endDate >= CURRENT_DATE")
    LocalDate findSoonestReturnDate(Long equipmentId);

    List<Reservation> findAllByEndDateBefore(LocalDate date);
}

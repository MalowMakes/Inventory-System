package com.malow.inventory_system.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import com.malow.inventory_system.model.Reservation;
import com.malow.inventory_system.repository.ReservationRepository;

import java.util.List;

@Service
public class CleanupService {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private EquipmentService EquipmentService;

    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredReservations() {
        LocalDate today = LocalDate.now();
        List<Reservation> expired = reservationRepository.findAllByEndDateBefore(today);

        for (Reservation res : expired) {
            EquipmentService.deleteReservation(res.getId());
        }
    }
}

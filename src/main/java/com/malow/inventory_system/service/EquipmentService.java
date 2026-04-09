package com.malow.inventory_system.service;

import com.malow.inventory_system.model.Equipment;
import com.malow.inventory_system.model.Reservation;
import com.malow.inventory_system.repository.EquipmentRepository;
import com.malow.inventory_system.repository.ReservationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class EquipmentService {

    /** 
     * Equipment repository 
     * */
    @Autowired 
    private EquipmentRepository repository;

    public List<Equipment> getAll() {
        return repository.findAll();
    }

    public List<Equipment> searchEquipment(String name) {
        return repository.findByNameContainingIgnoreCase(name);
    }

    public Equipment addEquipment(Equipment item) {
        // Validation Rule: Prevent negative prices
        if (item.getPricePerDay() < 0) {
            throw new RuntimeException("Price cannot be negative!");
        }
        return repository.save(item);
    }

    public void deleteEquipment(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Cannot delete item: Equipment with ID " + id + " does not exist.");
        }
        repository.deleteById(id);
    }

    /** 
     * Reservation repository 
     * */
    @Autowired
    private ReservationRepository reservationRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional
    public Reservation reserveEquipment(Long equipmentId, String customer, int days) {
        Equipment item = repository.findById(equipmentId)
            .orElseThrow(() -> new RuntimeException("Equipment not found"));

        if (item.getQuantity() < 1) {
            LocalDate availableDate = reservationRepository.findLatestReturnDate(equipmentId);
            throw new RuntimeException("Item out of stock! Expected available: " + availableDate);
        }

        // Reduce stock by 1
        item.setQuantity(item.getQuantity() - 1);
        repository.save(item);

        // Create the reservation record
        Reservation res = new Reservation();
        res.setEquipment(item);
        res.setCustomerName(customer);
        res.setStartDate(LocalDate.now());
        res.setEndDate(LocalDate.now().plusDays(days));

        return reservationRepository.save(res);
    }

    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete item: Reservation with ID " + id + " does not exist.");
        }
        repository.deleteById(id);
    }
}

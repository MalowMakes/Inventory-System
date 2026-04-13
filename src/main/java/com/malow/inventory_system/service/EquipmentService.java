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
     */
    @Autowired
    private EquipmentRepository equipmentRepository;

    public List<Equipment> getAll() {
        List<Equipment> allEquipment = equipmentRepository.findAll();

        for (Equipment item : allEquipment) {
            if (item.getCurrQuantity() > 0) {
                item.setStatus("Available");
            } else {
                LocalDate availableDate = reservationRepository.findSoonestReturnDate(item.getId());
                item.setStatus("Out of stock! Expected availablity: " + availableDate);
            }
        }
        return allEquipment;
    }

    public List<Equipment> searchEquipment(String name) {
        return equipmentRepository.findByNameContainingIgnoreCase(name);
    }

    public Equipment getById(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + id));
    }

    public Equipment save(Equipment equipment) {
        return equipmentRepository.save(equipment);
    }

    public Equipment addEquipment(Equipment item) {
        // Validation Rule: Prevent negative prices
        if (item.getPricePerDay() < 0) {
            throw new RuntimeException("Price cannot be negative!");
        }
        return equipmentRepository.save(item);
    }

    public void deleteEquipment(Long id) {
        if (!equipmentRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete item: Equipment with ID " + id + " does not exist.");
        }
        equipmentRepository.deleteById(id);
    }

    public String getEquipmentStatus (Long id) {
        Equipment item = equipmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Equipment not found with id: " + id));
            
        if (item.getCurrQuantity() > 0) {
                item.setStatus("Available");
            } else {
                LocalDate availableDate = reservationRepository.findSoonestReturnDate(item.getId());
                item.setStatus("Out of stock! Expected availablity: " + availableDate);
            }
            return item.getStatus();
    }

    /**
     * Reservation repository
     */
    @Autowired
    private ReservationRepository reservationRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional
    public Reservation reserveEquipment(Long equipmentId, String customer, int days) {
        Equipment item = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

        if (item.getCurrQuantity() < 1) {
            LocalDate availableDate = reservationRepository.findSoonestReturnDate(equipmentId);
            throw new RuntimeException("Item out of stock! Expected available: " + availableDate);
        }

        // Reduce stock by 1
        item.setCurrQuantity(item.getCurrQuantity() - 1);
        equipmentRepository.save(item);

        // Create the reservation record
        Reservation res = new Reservation();
        res.setEquipment(item);
        res.setCustomerName(customer);
        res.setStartDate(LocalDate.now());
        res.setEndDate(LocalDate.now().plusDays(days));

        return reservationRepository.save(res);
    }

    @Transactional
    public void deleteReservation(Long id) {
        Reservation res = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // Find the associated equipment
        Equipment equipment = res.getEquipment();
        // Increase the stock by 1
        equipment.setCurrQuantity(equipment.getCurrQuantity() + 1);
        // Save the updated equipment and delete the reservation
        equipmentRepository.save(equipment);
        reservationRepository.delete(res);
    }
}

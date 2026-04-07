package com.malow.inventory_system.service;

import com.malow.inventory_system.model.Equipment;
import com.malow.inventory_system.repository.EquipmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Tells Spring to manage this as a "Business Logic" component
public class EquipmentService {

    @Autowired
    private EquipmentRepository repository;

    public List<Equipment> getAll() {
        return repository.findAll();
    }

    public Equipment addEquipment(Equipment item) {
        // Validation Rule: Prevent negative prices
        if (item.getPricePerDay() < 0) {
            throw new RuntimeException("Price cannot be negative!");
        }
        return repository.save(item);
    }
    
    // We will add "RentItem" logic here later!
}

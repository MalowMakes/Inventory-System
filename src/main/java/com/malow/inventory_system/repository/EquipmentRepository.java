package com.malow.inventory_system.repository;

import com.malow.inventory_system.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipmentRepository extends JpaRepository<Equipment, Long>{
    // Thank you Spring Data JPA for writing the SQL commands
    List<Equipment> findByNameContainingIgnoreCase(String name);
}

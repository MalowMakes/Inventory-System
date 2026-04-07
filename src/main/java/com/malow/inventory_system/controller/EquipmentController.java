package com.malow.inventory_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.malow.inventory_system.model.Equipment;
import com.malow.inventory_system.repository.EquipmentRepository;
//import org.springframework.web.bind.annotation.*; - Will need this later.

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentRepository repository;

    @GetMapping // GET Requests
    public List<Equipment> getAllEquipment() {
        return repository.findAll(); // SQL -> Web
    }

    @PostMapping // POST requests
    public Equipment addEquipment(@RequestBody Equipment item) {
        return repository.save(item); // Web -> SQL
    }
}

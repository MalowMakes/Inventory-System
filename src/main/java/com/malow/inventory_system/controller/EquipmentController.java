package com.malow.inventory_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.malow.inventory_system.model.Equipment;
import com.malow.inventory_system.service.EquipmentService;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService service;

    @GetMapping // GET Requests
    public List<Equipment> getAll() {
        return service.getAll(); //Equipment
    }

    @PostMapping // POST requests
    public Equipment addEquipment(@RequestBody Equipment item) {
        return service.addEquipment(item);
    }
}

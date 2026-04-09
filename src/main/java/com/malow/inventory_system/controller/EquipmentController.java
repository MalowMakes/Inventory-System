package com.malow.inventory_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.malow.inventory_system.model.Equipment;
import com.malow.inventory_system.model.Reservation;
import com.malow.inventory_system.service.EquipmentService;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
public class EquipmentController {

    @Autowired
    private EquipmentService service;

    /** 
     * GET
     * */

    @GetMapping // GET all equipment
    public List<Equipment> getAll() {
        return service.getAll(); 
    }

    @GetMapping("/reservations") // GET all reservations
    public List<Reservation> getAllReservations() {
        return service.getAllReservations();
    }

    /** 
     * POST
     * */
    
    @PostMapping // POST new equipment
    public Equipment addEquipment(@RequestBody Equipment item) {
        return service.addEquipment(item);
    }
    
    @PostMapping("/{id}/rent") // Post reservation record by equipment ID
    public Reservation rentEquipment(@PathVariable Long id, @RequestParam String customer, @RequestParam int days) {
        return service.reserveEquipment(id, customer, days);
    }

    /** 
     * Delete
     * */

    @DeleteMapping("/{id}") // Delete equipment by ID
    public String delete(@PathVariable Long id) {
        service.deleteEquipment(id);
        return "Equipment " + id + " has been deleted successfully.";
    }

    @DeleteMapping("/reservations") // Delete reservation by ID
    public String deleteReservation(@PathVariable Long id) {
        service.deleteReservation(id);
        return "Reservation " + id + " has been deleted successfully.";
    }
}

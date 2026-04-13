package com.malow.inventory_system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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

    @GetMapping("/search") // GET equipment by name search
    public List<Equipment> search(@RequestParam String name) {
        return service.searchEquipment(name);
    }

    @GetMapping("/reservations") // GET all reservations
    public List<Reservation> getAllReservations() {
        return service.getAllReservations();
    }

    @GetMapping("/{id}/status") // GET status of equipment by ID
    public String getEquipmentStatus(@PathVariable Long id) {
        return service.getEquipmentStatus(id);
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
     * PUT
     * */

    @PutMapping("/{id}")
    public Equipment update(@PathVariable Long id, @RequestBody Equipment updatedItem) {
        Equipment existingItem = service.getById(id);
        
        existingItem.setName(updatedItem.getName());
        existingItem.setDescription(updatedItem.getDescription());
        existingItem.setCurrQuantity(updatedItem.getCurrQuantity());
        existingItem.setMaxQuantity(updatedItem.getMaxQuantity());
        existingItem.setPricePerDay(updatedItem.getPricePerDay());

        return service.save(existingItem);
    }

    /** 
     * DELETE
     * */

    @DeleteMapping("/{id}") // Delete equipment by ID
    public String delete(@PathVariable Long id) {
        service.deleteEquipment(id);
        return "Equipment " + id + " has been deleted successfully.";
    }

    @DeleteMapping("/reservations/{id}") // Delete reservation by ID
    public String deleteReservation(@PathVariable Long id) {
        service.deleteReservation(id);
        return "Reservation " + id + " has been deleted successfully.";
    }
}

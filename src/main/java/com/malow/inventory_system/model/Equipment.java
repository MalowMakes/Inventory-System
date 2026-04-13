package com.malow.inventory_system.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private int currQuantity;
    private int maxQuantity;
    private Double pricePerDay;

    @Column(nullable = false)
    private String category = "Miscellaneous";

    @Transient
    private String status;
}

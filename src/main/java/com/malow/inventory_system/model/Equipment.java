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
    private Integer currQuantity;
    private Integer maxQuantity;
    private Double pricePerDay;
}

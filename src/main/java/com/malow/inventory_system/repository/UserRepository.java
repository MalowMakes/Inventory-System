package com.malow.inventory_system.repository;

import com.malow.inventory_system.model.AppUser;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserRepository extends JpaRepository<AppUser, Long>{

    Optional<AppUser> findByUsername(String username);
}

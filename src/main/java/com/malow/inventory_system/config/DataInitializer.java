package com.malow.inventory_system.config;

import com.malow.inventory_system.model.AppUser;
import com.malow.inventory_system.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Wipe the old test users to be sure
            userRepository.findByUsername("user").ifPresent(userRepository::delete);
            userRepository.findByUsername("user2").ifPresent(userRepository::delete);
            userRepository.findByUsername("admin").ifPresent(userRepository::delete);

            AppUser testUser = new AppUser();
            testUser.setUsername("user");
            testUser.setPassword(passwordEncoder.encode("password321"));
            testUser.setRole("ROLE_USER");
            testUser.setFirstName("Sophie");

            userRepository.save(testUser);

            AppUser testUser2 = new AppUser();
            testUser2.setUsername("user2");
            testUser2.setPassword(passwordEncoder.encode("password321"));
            testUser2.setRole("ROLE_USER");
            testUser2.setFirstName("David");

            userRepository.save(testUser2);

            AppUser testUser3 = new AppUser();
            testUser3.setUsername("admin");
            testUser3.setPassword(passwordEncoder.encode("imtheboss")); // Encoded at runtime
            testUser3.setRole("ROLE_ADMIN"); // Notice the ROLE_ prefix
            testUser3.setFirstName("Matthew");

            userRepository.save(testUser3);

            System.out.println("--------------------------------------");
            System.out.println("DATABASE REFRESHED");
            System.out.println("User: user | Pass: password321 | Role: ROLE_USER");
            System.out.println("User: user2 | Pass: password321 | Role: ROLE_USER");
            System.out.println("User: admin | Pass: imtheboss | Role: ROLE_ADMIN");
            System.out.println("--------------------------------------");
        };
    }
}

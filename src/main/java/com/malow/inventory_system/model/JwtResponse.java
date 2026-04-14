package com.malow.inventory_system.model;

public class JwtResponse {
    private String token;
    private String username;
    private String role;
    private String firstName;

    public JwtResponse(String token, String username, String role, String firstName) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.firstName = firstName;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.reservation.restaurantReservation.controller;

/**
 *
 * @author Rümeysa
 */
import com.reservation.restaurantReservation.model.restaurant;
import com.reservation.restaurantReservation.service.restaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@CrossOrigin(origins = "http://localhost:5173")
public class restaurantController {

    @Autowired
    private restaurantService restaurantService;

    @GetMapping
    public List<restaurant> getAllRestaurants() {
        return restaurantService.getAllRestaurants();
    }

    @GetMapping("/{id}")
    public ResponseEntity<restaurant> getRestaurantById(@PathVariable Integer id) {
        return restaurantService.getRestaurantById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<restaurant> createRestaurant(@RequestBody restaurant restaurant) {
        restaurant created = restaurantService.createRestaurant(restaurant);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<restaurant> updateRestaurant(
            @PathVariable Integer id,
            @RequestBody restaurant updatedRestaurant
    ) {
        restaurant updated = restaurantService.updateRestaurant(id, updatedRestaurant);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRestaurant(@PathVariable Integer id) {
        boolean deleted = restaurantService.deleteRestaurant(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.reservation.restaurantReservation.service;

/**
 *
 * @author Rümeysa
 */
import com.reservation.restaurantReservation.model.restaurant;
import com.reservation.restaurantReservation.repository.restaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class restaurantService {

    @Autowired
    private restaurantRepository restaurantRepository;

    public List<restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Optional<restaurant> getRestaurantById(Integer id) {
        return restaurantRepository.findById(id);
    }

    public restaurant createRestaurant(restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public restaurant updateRestaurant(Integer id, restaurant updatedRestaurant) {
        Optional<restaurant> optionalRestaurant = restaurantRepository.findById(id);
        if (optionalRestaurant.isEmpty()) return null;

        restaurant existing = optionalRestaurant.get();

        existing.setName(updatedRestaurant.getName());
        existing.setLocation(updatedRestaurant.getLocation());
        existing.setDescription(updatedRestaurant.getDescription());
        existing.setImageUrl(updatedRestaurant.getImageUrl());
        existing.setRating(updatedRestaurant.getRating());
        existing.setPriceRange(updatedRestaurant.getPriceRange());

        // ✅ YENİ: İletişim alanları
        existing.setPhone(updatedRestaurant.getPhone());
        existing.setEmail(updatedRestaurant.getEmail());

        return restaurantRepository.save(existing);
    }

    public boolean deleteRestaurant(Integer id) {
        if (restaurantRepository.existsById(id)) {
            restaurantRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
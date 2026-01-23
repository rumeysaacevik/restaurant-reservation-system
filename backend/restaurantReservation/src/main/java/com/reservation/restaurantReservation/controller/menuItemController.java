/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.reservation.restaurantReservation.controller;

/**
 *
 * @author Rümeysa
 */
import com.reservation.restaurantReservation.model.menuItem;
import com.reservation.restaurantReservation.model.restaurant;
import com.reservation.restaurantReservation.service.menuItemService;
import com.reservation.restaurantReservation.service.restaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/menuitems")
@CrossOrigin(origins = "http://localhost:5173")
public class menuItemController {

    @Autowired
    private menuItemService menuItemService;

    @Autowired
    private restaurantService restaurantService;


    // 🔹 Restorana ait menü öğeleri
    @GetMapping("/restaurant/{restaurantId}")
    public List<menuItem> getByRestaurantId(@PathVariable Integer restaurantId) {
        return menuItemService.getMenuItemsByRestaurantId(restaurantId);
    }

    // 🔹 Yeni menü ekle (DTO kullanarak restaurantId kabul eder)
    @PostMapping
    public ResponseEntity<?> createMenuItem(@RequestBody MenuItemRequest request) {

        Optional<restaurant> restaurantOpt = restaurantService.getRestaurantById(request.restaurantId);
        if (restaurantOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Restoran bulunamadı!");
        }

        menuItem item = new menuItem();
        item.setName(request.name);
        item.setDescription(request.description);
        item.setPrice(request.price);
        item.setCategory(request.category);
        item.setImageUrl(request.imageUrl);
        item.setRestaurant(restaurantOpt.get());

        menuItem saved = menuItemService.saveMenuItem(item);

        return ResponseEntity.ok(saved);
    }

    // 🔹 Menü güncelle
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenuItem(@PathVariable Integer id, @RequestBody MenuItemRequest request) {

        Optional<restaurant> restaurantOpt = restaurantService.getRestaurantById(request.restaurantId);
        if (restaurantOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Restoran bulunamadı!");
        }

        menuItem updated = menuItemService.updateMenuItem(id, request, restaurantOpt.get());

        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // 🔹 Menü sil
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Integer id) {
        boolean deleted = menuItemService.deleteMenuItem(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    // ---------- DTO (Frontend’den gelen JSON formatı için) ----------
    public static class MenuItemRequest {
        public String name;
        public String description;
        public Double price;
        public String category;
        public String imageUrl;
        public Integer restaurantId;
    }
}
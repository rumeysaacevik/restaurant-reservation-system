/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.reservation.restaurantReservation.service;

/**
 *
 * @author Rümeysa
 */
import com.reservation.restaurantReservation.controller.menuItemController;
import com.reservation.restaurantReservation.model.menuItem;
import com.reservation.restaurantReservation.model.restaurant;
import com.reservation.restaurantReservation.repository.menuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class menuItemService {

    private final menuItemRepository menuItemRepository;

    public menuItemService(menuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    // Restorana ait menü
    public List<menuItem> getMenuItemsByRestaurantId(Integer restaurantId) {
        return menuItemRepository.findByRestaurant_Id(restaurantId);
    }

    // Menü kaydet
    public menuItem saveMenuItem(menuItem item) {
        return menuItemRepository.save(item);
    }

    // Menü güncelle (Object cast yok)
    public menuItem updateMenuItem(Integer id,
                                   menuItemController.MenuItemRequest request,
                                   restaurant restaurantObj) {

        Optional<menuItem> optional = menuItemRepository.findById(id);
        if (optional.isEmpty()) return null;

        menuItem item = optional.get();

        item.setName(request.name);
        item.setDescription(request.description);
        item.setPrice(request.price);
        item.setCategory(request.category);
        item.setImageUrl(request.imageUrl);
        item.setRestaurant(restaurantObj);

        return menuItemRepository.save(item);
    }

    // Menü sil
    public boolean deleteMenuItem(Integer id) {
        if (!menuItemRepository.existsById(id)) return false;
        menuItemRepository.deleteById(id);
        return true;
    }
}
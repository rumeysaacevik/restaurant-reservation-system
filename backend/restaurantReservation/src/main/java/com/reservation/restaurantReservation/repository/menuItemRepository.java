/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.reservation.restaurantReservation.repository;

import com.reservation.restaurantReservation.model.menuItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Rümeysa
 */
public interface menuItemRepository extends JpaRepository<menuItem, Integer> {

    // restaurant field'ı ManyToOne ise doğru query:
    List<menuItem> findByRestaurant_Id(Integer restaurantId);
}

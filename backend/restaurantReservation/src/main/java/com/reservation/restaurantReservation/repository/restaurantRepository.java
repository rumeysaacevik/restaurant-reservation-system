/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.reservation.restaurantReservation.repository;

import com.reservation.restaurantReservation.model.restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Rümeysa
 */

@Repository
public interface restaurantRepository extends JpaRepository<restaurant, Integer> {
}

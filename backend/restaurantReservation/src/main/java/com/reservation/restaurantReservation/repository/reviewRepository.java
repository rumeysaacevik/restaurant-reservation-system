/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.reservation.restaurantReservation.repository;

/**
 *
 * @author Rümeysa
 */
import com.reservation.restaurantReservation.model.Review;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface reviewRepository extends JpaRepository<Review, Integer> {

    List<Review> findByUser_Email(String email);

    List<Review> findByRestaurantId(Integer restaurantId);

    boolean existsByUser_IdAndRestaurant_Id(Integer userId, Integer restaurantId);
}

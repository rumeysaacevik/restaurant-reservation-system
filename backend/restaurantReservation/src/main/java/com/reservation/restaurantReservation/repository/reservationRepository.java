/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.reservation.restaurantReservation.repository;

import com.reservation.restaurantReservation.model.Reservation;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 *
 * @author Rümeysa
 */
public interface reservationRepository extends JpaRepository<Reservation, Integer> {

    List<Reservation> findByUserId(Integer userId);

    @Query("SELECT r FROM Reservation r WHERE r.restaurant.id = :restaurantId AND r.reservationTime = :time")
    List<Reservation> findReservationsAtTime(
            @Param("restaurantId") Integer restaurantId,
            @Param("time") LocalDateTime time
    );
}

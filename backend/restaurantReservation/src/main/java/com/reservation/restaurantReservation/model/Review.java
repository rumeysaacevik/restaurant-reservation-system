/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.reservation.restaurantReservation.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import lombok.Data;

/**
 *
 * @author Rümeysa
 */
@Entity
@Data
@Table(
    name = "reviews",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "restaurant_id"})
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer rating; // 1–5

    private String comment;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private user user;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private restaurant restaurant;

    private LocalDateTime createdAt = LocalDateTime.now();

    // getter & setter
}

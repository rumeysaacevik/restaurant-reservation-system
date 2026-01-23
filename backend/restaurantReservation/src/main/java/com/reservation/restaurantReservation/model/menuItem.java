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
import lombok.Data;

/**
 *
 * @author Rümeysa
 */
@Entity
@Table(name = "menu_items")
public class menuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    
    @Column(columnDefinition = "TEXT") // Uzun açıklamalar için
    private String description;
    
    private Double price;
    private String category;
    
    @Column(name = "image_url")
    private String imageUrl;

    // İlişki: Bu yemek hangi restorana ait?
    // Not: Senin proje yapında class adı 'restaurant' (küçük harf) olduğu için öyle kullandım.
    @ManyToOne
    @JoinColumn(name = "restaurant_id", nullable = false)
    private restaurant restaurant;

    // --- Getter ve Setter Metotları ---

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public restaurant getRestaurant() { return restaurant; }
    public void setRestaurant(restaurant restaurant) { this.restaurant = restaurant; }
}
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.reservation.restaurantReservation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 *
 * @author Rümeysa
 */
@Controller
public class AdminPageController {

    // 👤 Kullanıcılar → React AdminPanel
    @GetMapping("/admin/users")
    public String users() {
        return "redirect:http://localhost:5173/admin?tab=users";
    }

    // 🏪 Restoranlar → React AdminPanel
    @GetMapping("/admin/restaurants")
    public String restaurants() {
        return "redirect:http://localhost:5173/admin?tab=restaurants";
    }

    // 📅 Rezervasyonlar → React AdminPanel
    @GetMapping("/admin/reservations")
    public String reservations() {
        return "redirect:http://localhost:5173/admin?tab=reservations";
    }
}
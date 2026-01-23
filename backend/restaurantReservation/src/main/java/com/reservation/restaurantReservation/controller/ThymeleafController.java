/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.reservation.restaurantReservation.controller;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

/**
 *
 * @author Rümeysa
 */

    @Controller
public class ThymeleafController {

    @GetMapping("/server-info")
    public String serverInfo(Model model) {
        model.addAttribute("title", "Server Side Sayfa");
        model.addAttribute("message", "Bu sayfa Thymeleaf ile render edilmiştir.");
        model.addAttribute("status", "Sistem Çalışıyor ✅");
        return "server-info";
    }
}

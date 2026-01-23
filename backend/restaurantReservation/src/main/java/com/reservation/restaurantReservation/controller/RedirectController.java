/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.reservation.restaurantReservation.controller;

/**
 *
 * @author Rümeysa
 */
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RedirectController {

    // 🔁 Login başarılı olduktan sonra gösterilecek ara sayfa
    @GetMapping("/redirect")
    public String redirectPage() {
        return "redirect"; 
        // 👉 src/main/resources/templates/redirect.html
    }
}

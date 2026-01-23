/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.reservation.restaurantReservation.controller;

/**
 *
 * @author Rümeysa
 */
import com.reservation.restaurantReservation.repository.userRepository;
import com.reservation.restaurantReservation.repository.restaurantRepository;
import com.reservation.restaurantReservation.repository.reservationRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AdminSummaryController {

    private final userRepository userRepo;
    private final restaurantRepository restaurantRepo;
    private final reservationRepository reservationRepo;

    public AdminSummaryController(
            userRepository userRepo,
            restaurantRepository restaurantRepo,
            reservationRepository reservationRepo
    ) {
        this.userRepo = userRepo;
        this.restaurantRepo = restaurantRepo;
        this.reservationRepo = reservationRepo;
    }

    @GetMapping("/admin/summary")
    public String adminSummary(Model model) {

        model.addAttribute("userCount", userRepo.count());
        model.addAttribute("restaurantCount", restaurantRepo.count());
        model.addAttribute("reservationCount", reservationRepo.count());

        return "admin-summary";
    }
}

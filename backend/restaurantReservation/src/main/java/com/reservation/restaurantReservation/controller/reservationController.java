package com.reservation.restaurantReservation.controller;

import com.reservation.restaurantReservation.model.Reservation;
import com.reservation.restaurantReservation.model.restaurant;
import com.reservation.restaurantReservation.model.user;
import com.reservation.restaurantReservation.service.reservationService;
import com.reservation.restaurantReservation.service.restaurantService;
import com.reservation.restaurantReservation.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173")
public class reservationController {

    @Autowired
    private reservationService reservationService;

    @Autowired
    private userService userService;

    @Autowired
    private restaurantService restaurantService;

    // ✅ Tarih parse (ISO + Z destekli)
    private LocalDateTime parseToLocalDateTime(String input) {
        if (input == null || input.isBlank()) return null;

        try {
            return LocalDateTime.parse(input);
        } catch (Exception ignored) {}

        try {
            OffsetDateTime odt = OffsetDateTime.parse(input);
            return odt.toLocalDateTime();
        } catch (Exception ignored) {}

        try {
            Instant instant = Instant.parse(input);
            return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
        } catch (Exception ignored) {}

        throw new RuntimeException("Geçersiz tarih formatı: " + input);
    }

    // 🔹 ADMIN – tüm rezervasyonlar
    @GetMapping("/all")
    public List<Reservation> getAllReservationsAdmin() {
        return reservationService.getAllReservations();
    }

    // 🔹 ID ile rezervasyon
    @GetMapping("/{id}")
    public ResponseEntity<?> getReservationById(@PathVariable Integer id) {
        Reservation reservation = reservationService.getReservationById(id);
        if (reservation == null) {
            return ResponseEntity.badRequest().body("Rezervasyon bulunamadı!");
        }
        return ResponseEntity.ok(reservation);
    }

    // 🔹 YENİ REZERVASYON
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {

        if (request.restaurantId == null || request.userEmail == null || request.reservationTime == null) {
            return ResponseEntity.badRequest().body("Eksik rezervasyon bilgisi!");
        }

        Optional<restaurant> restaurantOpt =
                restaurantService.getRestaurantById(request.restaurantId);
        if (restaurantOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Restoran bulunamadı!");
        }

        Optional<user> userOpt = userService.findByEmail(request.userEmail);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Kullanıcı bulunamadı!");
        }

        Reservation reservation = new Reservation();
        reservation.setRestaurant(restaurantOpt.get());
        reservation.setUser(userOpt.get());
        reservation.setReservationTime(
                parseToLocalDateTime(request.reservationTime)
        );
        reservation.setNumberOfGuests(
                request.numberOfGuests != null ? request.numberOfGuests : 2
        );
        reservation.setStatus(Reservation.Status.PENDING);

        return ResponseEntity.ok(
                reservationService.createReservation(reservation)
        );
    }

    // 🔹 REZERVASYON GÜNCELLE
    @PutMapping("/{id}/edit")
    public ResponseEntity<?> editReservation(
            @PathVariable Integer id,
            @RequestBody EditReservationRequest request
    ) {

        Reservation existing = reservationService.getReservationById(id);
        if (existing == null) {
            return ResponseEntity.badRequest().body("Rezervasyon bulunamadı!");
        }

        if (request.reservationTime != null) {
            existing.setReservationTime(
                    parseToLocalDateTime(request.reservationTime)
            );
        }

        if (request.numberOfGuests != null) {
            existing.setNumberOfGuests(request.numberOfGuests);
        }

        return ResponseEntity.ok(
                reservationService.updateReservation(id, existing)
        );
    }

    // 🔹 REZERVASYON İPTAL
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Integer id) {

        Reservation cancelled =
                reservationService.updateReservationStatus(id, "CANCELLED");

        if (cancelled == null) {
            return ResponseEntity.badRequest().body("Rezervasyon bulunamadı!");
        }

        return ResponseEntity.ok(cancelled);
    }

    // 🔹 KULLANICI REZERVASYONLARI
    @GetMapping("/my-reservations")
    public ResponseEntity<?> getMyReservations(@RequestParam String email) {

        Optional<user> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Kullanıcı bulunamadı!");
        }

        return ResponseEntity.ok(
                reservationService.getReservationsByUserId(
                        userOpt.get().getId()
                )
        );
    }

    // ================= DTO =================

    static class ReservationRequest {
        public String userEmail;
        public Integer restaurantId;
        public String reservationTime;
        public Integer numberOfGuests;
    }

    static class EditReservationRequest {
        public String reservationTime;
        public Integer numberOfGuests;
    }
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.reservation.restaurantReservation.service;

/**
 *
 * @author Rümeysa
 */
import com.reservation.restaurantReservation.model.Reservation;
import com.reservation.restaurantReservation.repository.reservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class reservationService {

    @Autowired
    private reservationRepository reservationRepository;

    // 🔹 Tüm rezervasyonları getir
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // 🔹 ID'ye göre rezervasyon getir
    public Reservation getReservationById(Integer id) {
        return reservationRepository.findById(id).orElse(null);
    }

    // 🔹 Yeni rezervasyon oluştur
    public Reservation createReservation(Reservation reservation) {
        return reservationRepository.save(reservation);
    }

    // ✅ Rezervasyon güncelle (null alanlar eskiyi bozmasın)
    public Reservation updateReservation(Integer id, Reservation updatedReservation) {
        Optional<Reservation> optional = reservationRepository.findById(id);
        if (optional.isEmpty()) return null;

        Reservation existing = optional.get();

        if (updatedReservation.getReservationTime() != null) {
            existing.setReservationTime(updatedReservation.getReservationTime());
        }

        if (updatedReservation.getNumberOfGuests() != null) {
            existing.setNumberOfGuests(updatedReservation.getNumberOfGuests());
        }

        // status null gelirse ezme
        if (updatedReservation.getStatus() != null) {
            existing.setStatus(updatedReservation.getStatus());
        }

        if (updatedReservation.getRestaurant() != null) {
            existing.setRestaurant(updatedReservation.getRestaurant());
        }

        if (updatedReservation.getUser() != null) {
            existing.setUser(updatedReservation.getUser());
        }

        return reservationRepository.save(existing);
    }

    // 🔹 Rezervasyon sil
    public boolean deleteReservation(Integer id) {
        if (!reservationRepository.existsById(id)) {
            return false;
        }
        reservationRepository.deleteById(id);
        return true;
    }

    // 🔹 Kullanıcıya ait rezervasyonları getir
    public List<Reservation> getReservationsByUserId(Integer userId) {
        return reservationRepository.findByUserId(userId);
    }

    // 🔹 DURUM GÜNCELLEME (Admin/Kullanıcı)
    public Reservation updateReservationStatus(Integer id, String statusName) {

        Optional<Reservation> opt = reservationRepository.findById(id);
        if (opt.isEmpty()) return null;

        Reservation r = opt.get();

        try {
            Reservation.Status newStatus = Reservation.Status.valueOf(statusName.toUpperCase());
            r.setStatus(newStatus);
        } catch (Exception e) {
            return null; // geçersiz durum adı
        }

        return reservationRepository.save(r);
    }
}

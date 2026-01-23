package com.reservation.restaurantReservation.service;

import com.reservation.restaurantReservation.model.Review;
import com.reservation.restaurantReservation.model.restaurant;
import com.reservation.restaurantReservation.model.user;
import com.reservation.restaurantReservation.repository.restaurantRepository;
import com.reservation.restaurantReservation.repository.reviewRepository;
import com.reservation.restaurantReservation.repository.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class reviewService {

    private final reviewRepository reviewRepository;

    public reviewService(reviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    public boolean alreadyReviewed(Integer userId, Integer restaurantId) {
        return reviewRepository.existsByUser_IdAndRestaurant_Id(userId, restaurantId);
    }

    public List<Review> getReviewsByRestaurant(Integer restaurantId) {
        return reviewRepository.findAll().stream()
                .filter(r -> r.getRestaurant().getId().equals(restaurantId))
                .toList();
    }

    // ✅ İŞTE EKSİK OLAN METOT
    public List<Review> getReviewsByUserEmail(String email) {
        return reviewRepository.findByUser_Email(email);
    }
}

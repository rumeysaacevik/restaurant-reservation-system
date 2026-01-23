package com.reservation.restaurantReservation.controller;

import com.reservation.restaurantReservation.model.Review;
import com.reservation.restaurantReservation.model.restaurant;
import com.reservation.restaurantReservation.model.user;
import com.reservation.restaurantReservation.service.restaurantService;
import com.reservation.restaurantReservation.service.reviewService;
import com.reservation.restaurantReservation.service.userService;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author Rümeysa
 */
@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class reviewController {

    private final reviewService reviewService;
    private final userService userService;
    private final restaurantService restaurantService;

    public reviewController(
            reviewService reviewService,
            userService userService,
            restaurantService restaurantService
    ) {
        this.reviewService = reviewService;
        this.userService = userService;
        this.restaurantService = restaurantService;
    }

    // ==================== YORUM OLUŞTUR ====================
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest req) {

        Optional<user> userOpt = userService.findById(req.userId);
        Optional<restaurant> restOpt = restaurantService.getRestaurantById(req.restaurantId);

        if (userOpt.isEmpty() || restOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Kullanıcı veya restoran bulunamadı!");
        }

        if (reviewService.alreadyReviewed(req.userId, req.restaurantId)) {
            return ResponseEntity.badRequest().body("Bu restoranı zaten değerlendirdiniz!");
        }

        Review review = new Review();
        review.setRating(req.rating);
        review.setComment(req.comment);
        review.setUser(userOpt.get());
        review.setRestaurant(restOpt.get());

        return ResponseEntity.ok(reviewService.createReview(review));
    }

    // ==================== RESTORANA GÖRE YORUMLAR ====================
    @GetMapping("/restaurant/{id}")
    public List<Review> getReviewsByRestaurant(@PathVariable Integer id) {
        return reviewService.getReviewsByRestaurant(id);
    }

    // ==================== KULLANICIYA GÖRE YORUMLAR (EMAIL) ====================
    @GetMapping("/user")
    public List<Review> getReviewsByUserEmail(@RequestParam String email) {
        return reviewService.getReviewsByUserEmail(email);
    }

    // ==================== DTO ====================
    static class ReviewRequest {
        public Integer userId;
        public Integer restaurantId;
        public Integer rating;
        public String comment;
    }
}

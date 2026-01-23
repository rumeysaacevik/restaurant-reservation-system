package com.reservation.restaurantReservation.controller;

import com.reservation.restaurantReservation.model.user;
import com.reservation.restaurantReservation.security.JwtUtil;
import com.reservation.restaurantReservation.service.userService;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * @author Rümeysa
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class userController {

    private final userService userService;

    @Autowired
    public userController(userService userService) {
        this.userService = userService;
    }

    // ==================== TÜM KULLANICILAR ====================
    @GetMapping
    public ResponseEntity<List<user>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ==================== KULLANICI SİL ====================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        boolean deleted = userService.deleteUser(id);
        if (!deleted) {
            return ResponseEntity.status(404).body("Kullanıcı bulunamadı");
        }
        return ResponseEntity.ok().build();
    }

    // ==================== ROL GÜNCELLE ====================
    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Integer id,
            @RequestBody RoleRequest request) {

        user updated = userService.updateUserRole(id, request.getRole());
        if (updated == null) {
            return ResponseEntity.badRequest().body("Rol güncellenemedi");
        }
        return ResponseEntity.ok(updated);
    }

    // ==================== REGISTER (KAYIT OL) ====================
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody user newUser) {
        try {
            user createdUser = userService.registerUser(newUser);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== LOGIN (JWT) ====================
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    try {
        user u = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        String token = JwtUtil.generateToken(
                u.getEmail(),
                u.getRole().name()
        );

        return ResponseEntity.ok(
                Map.of(
                        "id", u.getId(),
                        "name", u.getName(),
                        "email", u.getEmail(),
                        "role", u.getRole().name(),
                        "token", token
                )
        );

    } catch (RuntimeException e) {
        // 🔥 ASIL ÖNEMLİ SATIR
        return ResponseEntity.status(401).body(e.getMessage());
    }
}


    // ==================== UPDATE USER (PROFİL GÜNCELLE) ====================
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody user updatedUser) {
        try {
            user result = userService.updateUser(updatedUser);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== UPDATE PASSWORD ====================
    @PutMapping("/{id}/update-password")
    public ResponseEntity<?> updatePassword(
            @PathVariable Integer id,
            @RequestBody PasswordUpdateRequest request) {
        try {
            userService.updatePassword(id, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok("Şifre güncellendi");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== DTO'LAR ====================
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }
        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }
        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class RoleRequest {
        private String role;

        public String getRole() {
            return role;
        }
        public void setRole(String role) {
            this.role = role;
        }
    }

    // ✅ EKSİK OLAN DTO: PasswordUpdateRequest
    public static class PasswordUpdateRequest {
        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() {
            return currentPassword;
        }
        public void setCurrentPassword(String currentPassword) {
            this.currentPassword = currentPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }
        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}

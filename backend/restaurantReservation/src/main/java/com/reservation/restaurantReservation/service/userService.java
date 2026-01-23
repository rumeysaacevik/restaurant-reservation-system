package com.reservation.restaurantReservation.service;

import com.reservation.restaurantReservation.model.user;
import com.reservation.restaurantReservation.model.user.Role;
import com.reservation.restaurantReservation.repository.userRepository;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * @author Rümeysa
 */


@Service
public class userService {

    private final userRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public userService(userRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<user> findById(Integer id) {
        return userRepository.findById(id);
    }

    public List<user> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<user> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

// ================= LOGIN (KİLİT MANTIKLI) =================
public user login(String email, String rawPassword) {

    user u = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Email veya şifre hatalı"));

    // 🔒 Hesap kilitli mi?
    if (u.getLockUntil() != null && u.getLockUntil().isAfter(LocalDateTime.now())) {

        long minutesLeft = ChronoUnit.MINUTES.between(
                LocalDateTime.now(),
                u.getLockUntil()
        );

        throw new RuntimeException(
            "Hesabınız güvenlik nedeniyle kilitlendi. "
            + minutesLeft + " dakika sonra tekrar deneyin."
        );
    }

    // ❌ Şifre yanlış
    if (!passwordEncoder.matches(rawPassword, u.getPassword())) {

        int attempts = (u.getFailedLoginAttempts() == null)
                ? 1
                : u.getFailedLoginAttempts() + 1;

        u.setFailedLoginAttempts(attempts);

        // 🚫 3 yanlış → kilitle
        if (attempts >= 3) {
            u.setLockUntil(LocalDateTime.now().plusMinutes(15));
            u.setFailedLoginAttempts(0);
        }

        userRepository.save(u);
        throw new RuntimeException("Email veya şifre hatalı");
    }

    // ✅ Başarılı giriş → reset
    u.setFailedLoginAttempts(0);
    u.setLockUntil(null);

    return userRepository.save(u);
}



    // ================= REGISTER =================
    public user registerUser(user newUser) {
        if (newUser.getName() == null || newUser.getName().isBlank()
                || newUser.getSurname() == null || newUser.getSurname().isBlank()) {
            throw new RuntimeException("İsim ve soyisim zorunludur.");
        }

        if (newUser.getEmail() == null || newUser.getEmail().isBlank()) {
            throw new RuntimeException("E-posta adresi zorunludur.");
        }

        if (userRepository.findByEmail(newUser.getEmail()).isPresent()) {
            throw new RuntimeException("Bu e-posta zaten kayıtlı.");
        }

        if (newUser.getPassword() == null || newUser.getPassword().isBlank()) {
            throw new RuntimeException("Şifre boş olamaz.");
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        newUser.setRole(newUser.getRole() == null ? Role.USER : newUser.getRole());
        newUser.setFailedLoginAttempts(0);
        newUser.setLockUntil(null);

        return userRepository.save(newUser);
    }

    // ================= UPDATE / DELETE / ROLE =================
    public user updateUser(user updatedUser) {
        user existing = userRepository.findById(updatedUser.getId())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (!existing.getEmail().equalsIgnoreCase(updatedUser.getEmail())
                && userRepository.existsByEmail(updatedUser.getEmail())) {
            throw new RuntimeException("Bu e-posta başka bir kullanıcı tarafından kullanılıyor!");
        }

        existing.setEmail(updatedUser.getEmail());
        existing.setName(updatedUser.getName());
        existing.setSurname(updatedUser.getSurname());
        existing.setPhoneNumber(updatedUser.getPhoneNumber());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(existing);
    }

    public boolean deleteUser(Integer id) {
        if (!userRepository.existsById(id)) return false;
        userRepository.deleteById(id);
        return true;
    }

    public user updateUserRole(Integer id, String roleName) {
        user u = userRepository.findById(id).orElse(null);
        if (u == null) return null;

        u.setRole(Role.valueOf(roleName.toUpperCase()));
        return userRepository.save(u);
    }

    public void updatePassword(Integer id, String currentPassword, String newPassword) throws Exception {
        user u = userRepository.findById(id)
                .orElseThrow(() -> new Exception("Kullanıcı bulunamadı"));

        if (!passwordEncoder.matches(currentPassword, u.getPassword())) {
            throw new Exception("Mevcut şifre hatalı!");
        }

        u.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(u);
    }
}

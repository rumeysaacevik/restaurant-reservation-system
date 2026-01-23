package com.reservation.restaurantReservation.repository;

/**
 *
 * @author Rümeysa
 */
import com.reservation.restaurantReservation.model.user;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface userRepository extends JpaRepository<user, Integer> {

    Optional<user> findByEmail(String email);

    boolean existsByEmail(String email);
}

package com.reservation.restaurantReservation.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class securityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // CSRF kapalı
            .csrf(csrf -> csrf.disable())

            // ❌ FORM LOGIN TAMAMEN KAPALI
            .formLogin(form -> form.disable())

            // ❌ HTTP BASIC KAPALI
            .httpBasic(basic -> basic.disable())

            // 🔐 Yetkilendirme
            .authorizeHttpRequests(auth -> auth
                // React & public
                .requestMatchers(
                    "/api/**",
                    "/css/**",
                    "/js/**",
                    "/images/**"
                ).permitAll()

                // 🔐 SADECE ADMIN SUMMARY (THYMELEAF)
                .requestMatchers("/admin-summary").authenticated()

                // Diğer her şey
                .anyRequest().permitAll()
            )

            // 🚪 Logout (opsiyonel)
            .logout(logout -> logout
                .logoutSuccessUrl("http://localhost:5173/")
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }
}

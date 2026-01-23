/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.reservation.restaurantReservation.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;

/**
 *
 * @author Rümeysa
 */
public class JwtUtil {

    // 🔐 HS256 için doğru key üretimi
    private static final SecretKey SECRET_KEY
            = Keys.hmacShaKeyFor(
                    "restaurant_reservation_secret_key_1234567890123456"
                            .getBytes()
            );

    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 saat

    // ✅ TOKEN ÜRET
    public static String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION_TIME)
                )
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ CLAIMS OKU
    public static Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public static String extractEmail(String token) {
        return getClaims(token).getSubject();
    }
}

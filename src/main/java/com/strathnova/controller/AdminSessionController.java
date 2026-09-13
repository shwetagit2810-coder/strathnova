package com.strathnova.controller;

import com.strathnova.dto.SessionTokenRequest;
import com.strathnova.security.CookieBearerTokenResolver;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.time.Instant;

/**
 * Turns a Clerk session token (handed over by the login page's JS after Clerk
 * confirms sign-in) into the {@value CookieBearerTokenResolver#COOKIE_NAME} cookie
 * that {@link CookieBearerTokenResolver} reads on every subsequent /admin/** request.
 */
@RestController
@RequestMapping("/admin")
public class AdminSessionController {

    private final JwtDecoder jwtDecoder;

    public AdminSessionController(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @PostMapping("/session")
    public ResponseEntity<Void> createSession(@Valid @RequestBody SessionTokenRequest request,
            HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        try {
            Jwt jwt = jwtDecoder.decode(request.getToken());
            httpResponse.addHeader("Set-Cookie", sessionCookie(request.getToken(), cookieTtl(jwt), httpRequest.isSecure()).toString());
            return ResponseEntity.noContent().build();
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        httpResponse.addHeader("Set-Cookie", sessionCookie("", Duration.ZERO, httpRequest.isSecure()).toString());
        return ResponseEntity.status(HttpStatus.FOUND).header("Location", "/admin/login").build();
    }

    private ResponseCookie sessionCookie(String value, Duration ttl, boolean secure) {
        return ResponseCookie.from(CookieBearerTokenResolver.COOKIE_NAME, value)
                .httpOnly(true)
                .secure(secure)
                .sameSite("Lax")
                .path("/")
                .maxAge(ttl)
                .build();
    }

    private Duration cookieTtl(Jwt jwt) {
        Instant expiresAt = jwt.getExpiresAt();
        if (expiresAt == null) {
            return Duration.ofHours(1);
        }
        Duration ttl = Duration.between(Instant.now(), expiresAt);
        return ttl.isNegative() ? Duration.ZERO : ttl;
    }
}

package com.app.movie.config;

import java.time.Duration;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Everything that changes between local and production, read from application.yml
 * (and from environment variables in production).
 */
@ConfigurationProperties(prefix = "notflix")
public record AppProperties(Jwt jwt, List<String> allowedOrigins, Guest guest, boolean seed) {

    public record Jwt(String secret, Duration expiration) {
    }

    /** The visitor account behind "Entrar como invitado", so nobody has to sign up to look around. */
    public record Guest(String email, String password, String name) {
    }
}

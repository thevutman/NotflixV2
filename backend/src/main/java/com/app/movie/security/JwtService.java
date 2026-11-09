package com.app.movie.security;

import com.app.movie.config.AppProperties;
import com.app.movie.entities.Client;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

/**
 * Signed, expiring tokens. The 2022 version sent "email:password" in base64 on every request;
 * now the password travels once, at login, and the token carries only the viewer's id and role.
 */
@Service
public class JwtService {

    private final SecretKey key;
    private final AppProperties.Jwt config;

    public JwtService(AppProperties properties) {
        this.config = properties.jwt();
        byte[] secret = config.secret().getBytes(StandardCharsets.UTF_8);
        if (secret.length < 32) {
            throw new IllegalStateException("notflix.jwt.secret necesita al menos 32 caracteres");
        }
        this.key = Keys.hmacShaKeyFor(secret);
    }

    public String issue(Client client) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(client.getId())
                .claim("role", client.getRole().name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(config.expiration())))
                .signWith(key)
                .compact();
    }

    public Optional<Claims> read(String token) {
        try {
            return Optional.of(Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload());
        } catch (JwtException | IllegalArgumentException ex) {
            return Optional.empty();
        }
    }
}

package com.app.movie.service;

import com.app.movie.config.AppProperties;
import com.app.movie.dto.AuthDto;
import com.app.movie.dto.AuthResponseDto;
import com.app.movie.entities.Client;
import com.app.movie.exception.ApiException;
import com.app.movie.repository.ClientRepository;
import com.app.movie.repository.ScoreRepository;
import com.app.movie.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final ClientRepository repository;
    private final ScoreRepository scores;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwt;
    private final AppProperties properties;

    public AuthService(ClientRepository repository, ScoreRepository scores, PasswordEncoder passwordEncoder, JwtService jwt,
            AppProperties properties) {
        this.repository = repository;
        this.scores = scores;
        this.passwordEncoder = passwordEncoder;
        this.jwt = jwt;
        this.properties = properties;
    }

    /** Same check as the original: find the email, compare against the BCrypt hash. Now it also says no. */
    public AuthResponseDto check(AuthDto request) {
        Client client = repository.findByEmail(request.user().trim().toLowerCase())
                .filter(found -> passwordEncoder.matches(request.password(), found.getPassword()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Email o contraseña incorrectos"));
        return respond(client);
    }

    /**
     * Signs in as the shared visitor account, without the visitor ever seeing its password.
     * Every visitor starts with an empty "Mi lista" instead of inheriting the last one's.
     */
    public AuthResponseDto guest() {
        Client guest = repository.findByEmail(properties.guest().email())
                .orElseThrow(() -> new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "El modo invitado no está disponible"));
        scores.deleteAll(scores.findByClientIdOrderByCreatedAtDesc(guest.getId()));
        return respond(guest);
    }

    public AuthResponseDto respond(Client client) {
        return new AuthResponseDto(client.getId(), jwt.issue(client), client.fullName(), client.getEmail(),
                client.getRole().name());
    }
}

package com.app.movie.service;

import com.app.movie.config.AppProperties;
import com.app.movie.dto.AuthResponseDto;
import com.app.movie.dto.ClientUpdateDto;
import com.app.movie.dto.RegisterDto;
import com.app.movie.entities.Client;
import com.app.movie.exception.ApiException;
import com.app.movie.repository.ClientRepository;
import com.app.movie.repository.ScoreRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    private final ClientRepository repository;
    private final ScoreRepository scores;
    private final PasswordEncoder passwordEncoder;
    private final AuthService auth;
    private final AppProperties properties;

    public ClientService(ClientRepository repository, ScoreRepository scores, PasswordEncoder passwordEncoder,
            AuthService auth, AppProperties properties) {
        this.repository = repository;
        this.scores = scores;
        this.passwordEncoder = passwordEncoder;
        this.auth = auth;
        this.properties = properties;
    }

    /** Registers and signs in at once, so the register form lands straight on the catalogue. */
    public AuthResponseDto create(RegisterDto request) {
        String email = request.email().trim().toLowerCase();
        if (repository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "EL EMAIL YA SE ENCUENTRA REGISTRADO");
        }
        Client client = new Client();
        client.setEmail(email);
        client.setPassword(passwordEncoder.encode(request.password()));
        client.setName(request.name().trim());
        client.setLastName(request.lastName() == null ? "" : request.lastName().trim());
        client.setBirthDate(request.birthDate());
        client.setPhone(request.phone());
        return auth.respond(repository.save(client));
    }

    public Client me(String id) {
        return repository.findById(id).orElseThrow(() -> ApiException.notFound("La cuenta"));
    }

    public Client update(String id, ClientUpdateDto request) {
        Client client = me(id);
        guardGuest(client);
        client.setName(request.name().trim());
        client.setLastName(request.lastName() == null ? "" : request.lastName().trim());
        client.setBirthDate(request.birthDate());
        client.setPhone(request.phone());
        return repository.save(client);
    }

    public void delete(String id) {
        Client client = me(id);
        guardGuest(client);
        scores.findByClientIdOrderByCreatedAtDesc(id).forEach(scores::delete);
        repository.delete(client);
    }

    /** Everyone shares the visitor account, so nobody gets to rename or delete it. */
    private void guardGuest(Client client) {
        if (client.getEmail().equals(properties.guest().email())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "La cuenta de invitado no se puede modificar");
        }
    }
}

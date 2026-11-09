package com.app.movie.controller;

import com.app.movie.dto.AuthResponseDto;
import com.app.movie.dto.ClientUpdateDto;
import com.app.movie.dto.RegisterDto;
import com.app.movie.entities.Client;
import com.app.movie.security.CurrentClient;
import com.app.movie.service.ClientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/client")
public class ClientController {

    private final ClientService service;

    public ClientController(ClientService service) {
        this.service = service;
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponseDto create(@Valid @RequestBody RegisterDto request) {
        return service.create(request);
    }

    @GetMapping("/me")
    public Client me() {
        return service.me(CurrentClient.id());
    }

    @PutMapping("/me")
    public Client update(@Valid @RequestBody ClientUpdateDto request) {
        return service.update(CurrentClient.id(), request);
    }

    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete() {
        service.delete(CurrentClient.id());
    }
}

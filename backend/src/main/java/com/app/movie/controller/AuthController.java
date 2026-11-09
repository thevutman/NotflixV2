package com.app.movie.controller;

import com.app.movie.dto.AuthDto;
import com.app.movie.dto.AuthResponseDto;
import com.app.movie.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("")
    public AuthResponseDto check(@Valid @RequestBody AuthDto request) {
        return service.check(request);
    }

    @PostMapping("/guest")
    public AuthResponseDto guest() {
        return service.guest();
    }
}

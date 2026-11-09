package com.app.movie.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthDto(
        @NotBlank(message = "Escribe tu email") @Email(message = "El email no es válido") String user,
        @NotBlank(message = "Escribe tu contraseña") String password) {
}

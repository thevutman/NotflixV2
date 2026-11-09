package com.app.movie.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterDto(
        @NotBlank(message = "Escribe tu nombre") @Size(max = 60) String name,
        @Size(max = 60) String lastName,
        @NotBlank(message = "Escribe tu email") @Email(message = "El email no es válido") String email,
        @NotBlank(message = "Escribe una contraseña")
        @Size(min = 8, max = 72, message = "La contraseña debe tener entre 8 y 72 caracteres") String password,
        String birthDate,
        @Size(max = 20) String phone) {
}

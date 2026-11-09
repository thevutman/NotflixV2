package com.app.movie.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClientUpdateDto(
        @NotBlank(message = "Escribe tu nombre") @Size(max = 60) String name,
        @Size(max = 60) String lastName,
        String birthDate,
        @Size(max = 20) String phone) {
}

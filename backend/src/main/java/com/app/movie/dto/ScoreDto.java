package com.app.movie.dto;

import com.app.movie.entities.TitleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ScoreDto(
        @NotBlank(message = "Falta el título") String titleId,
        @NotNull(message = "Falta el tipo") TitleType type) {
}

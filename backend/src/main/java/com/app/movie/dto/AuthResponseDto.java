package com.app.movie.dto;

public record AuthResponseDto(String id, String token, String name, String email, String role) {
}

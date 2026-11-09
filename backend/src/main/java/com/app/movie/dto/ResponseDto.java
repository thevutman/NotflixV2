package com.app.movie.dto;

/** Same envelope as the 2022 version, so messages keep reading the way the team wrote them. */
public record ResponseDto(boolean status, String message, String id) {

    public static ResponseDto ok(String message, String id) {
        return new ResponseDto(true, message, id);
    }

    public static ResponseDto error(String message) {
        return new ResponseDto(false, message, null);
    }
}

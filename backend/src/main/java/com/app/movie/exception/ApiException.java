package com.app.movie.exception;

import org.springframework.http.HttpStatus;

/** An error the client caused; the handler turns it into a ResponseDto with this status. */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public static ApiException notFound(String what) {
        return new ApiException(HttpStatus.NOT_FOUND, what + " no existe");
    }
}

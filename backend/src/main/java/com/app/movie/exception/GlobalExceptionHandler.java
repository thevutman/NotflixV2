package com.app.movie.exception;

import com.app.movie.dto.ResponseDto;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/** Every error leaves the API with the same shape the original app used: {status, message}. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    ResponseEntity<ResponseDto> api(ApiException ex) {
        return ResponseEntity.status(ex.getStatus()).body(ResponseDto.error(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ResponseDto> invalid(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .distinct()
                .collect(Collectors.joining(". "));
        return ResponseEntity.badRequest().body(ResponseDto.error(message));
    }

    @ExceptionHandler(org.springframework.web.servlet.resource.NoResourceFoundException.class)
    ResponseEntity<ResponseDto> missing() {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseDto.error("Ruta no encontrada"));
    }
}

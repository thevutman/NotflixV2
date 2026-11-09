package com.app.movie.security;

import com.app.movie.exception.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/** The id of the viewer making the request, taken from the verified token. */
public final class CurrentClient {

    private CurrentClient() {
    }

    public static String id() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof String id)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Inicia sesión para continuar");
        }
        return id;
    }
}

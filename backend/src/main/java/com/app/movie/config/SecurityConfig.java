package com.app.movie.config;

import com.app.movie.dto.ResponseDto;
import com.app.movie.security.JwtAuthFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Browsing the catalogue is public. Liking, "Mi lista" and the account need a token;
 * adding, editing or deleting titles needs an admin token.
 */
@Configuration
public class SecurityConfig {

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtFilter, ObjectMapper json) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> { })
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/actuator/health", "/v3/api-docs/**", "/swagger-ui/**",
                                "/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/client").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/movie/**", "/api/series/**", "/api/category/**",
                                "/api/catalog/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/movie/*/play", "/api/series/*/play").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/movie", "/api/series", "/api/category")
                                .hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/movie/**", "/api/series/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/movie/**", "/api/series/**").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((req, res, ex) ->
                                write(res, json, HttpStatus.UNAUTHORIZED, "Inicia sesión para continuar"))
                        .accessDeniedHandler((req, res, ex) ->
                                write(res, json, HttpStatus.FORBIDDEN, "No tienes permiso para hacer esto")))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    private static void write(HttpServletResponse res, ObjectMapper json, HttpStatus status, String message)
            throws IOException {
        res.setStatus(status.value());
        res.setContentType(MediaType.APPLICATION_JSON_VALUE);
        res.setCharacterEncoding("UTF-8");
        json.writeValue(res.getOutputStream(), ResponseDto.error(message));
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(AppProperties properties) {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(properties.allowedOrigins());
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

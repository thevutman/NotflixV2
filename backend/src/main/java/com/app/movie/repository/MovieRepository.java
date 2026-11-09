package com.app.movie.repository;

import com.app.movie.entities.Movie;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MovieRepository extends MongoRepository<Movie, String> {
    Optional<Movie> findBySlug(String slug);
    boolean existsBySlug(String slug);
}

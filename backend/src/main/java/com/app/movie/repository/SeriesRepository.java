package com.app.movie.repository;

import com.app.movie.entities.Series;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SeriesRepository extends MongoRepository<Series, String> {
    Optional<Series> findBySlug(String slug);
    boolean existsBySlug(String slug);
}

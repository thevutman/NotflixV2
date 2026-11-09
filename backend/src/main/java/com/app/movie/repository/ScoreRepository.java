package com.app.movie.repository;

import com.app.movie.entities.Score;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ScoreRepository extends MongoRepository<Score, String> {
    List<Score> findByClientIdOrderByCreatedAtDesc(String clientId);
    Optional<Score> findByClientIdAndTitleId(String clientId, String titleId);
    void deleteByClientIdAndTitleId(String clientId, String titleId);
}

package com.app.movie.service;

import com.app.movie.dto.ResponseDto;
import com.app.movie.dto.ScoreCheckDto;
import com.app.movie.dto.ScoreDto;
import com.app.movie.entities.Score;
import com.app.movie.entities.Title;
import com.app.movie.entities.TitleType;
import com.app.movie.repository.ScoreRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

/** The heart button and "Mi lista". */
@Service
public class ScoreService {

    private final ScoreRepository repository;
    private final MovieService movies;
    private final SeriesService series;

    public ScoreService(ScoreRepository repository, MovieService movies, SeriesService series) {
        this.repository = repository;
        this.movies = movies;
        this.series = series;
    }

    /** The titles the viewer liked, newest first, ready to draw as cards. */
    public List<Title> myList(String clientId) {
        return repository.findByClientIdOrderByCreatedAtDesc(clientId).stream()
                .map(score -> resolve(score.getType(), score.getTitleId()))
                .flatMap(Optional::stream)
                .toList();
    }

    public ScoreCheckDto check(String clientId, String titleId) {
        return repository.findByClientIdAndTitleId(clientId, titleId)
                .map(score -> new ScoreCheckDto(score.getId(), true))
                .orElse(new ScoreCheckDto(null, false));
    }

    /** Liking twice is harmless: the second call returns the existing like. */
    public ResponseDto create(String clientId, ScoreDto request) {
        Title title = request.type() == TitleType.MOVIE
                ? movies.getById(request.titleId())
                : series.getById(request.titleId());
        Score score = repository.findByClientIdAndTitleId(clientId, title.getId()).orElseGet(() -> {
            Score fresh = new Score();
            fresh.setClientId(clientId);
            fresh.setTitleId(title.getId());
            fresh.setType(request.type());
            return repository.save(fresh);
        });
        return ResponseDto.ok("AGREGADA A MI LISTA", score.getId());
    }

    public void delete(String clientId, String titleId) {
        repository.deleteByClientIdAndTitleId(clientId, titleId);
    }

    private Optional<Title> resolve(TitleType type, String id) {
        return type == TitleType.MOVIE
                ? movies.find(id).map(Title.class::cast)
                : series.find(id).map(Title.class::cast);
    }
}

package com.app.movie.service;

import com.app.movie.entities.Movie;
import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class MovieService extends TitleService<Movie> {

    public MovieService(MongoTemplate mongo) {
        super(mongo, Movie.class, "La película");
    }

    @Override
    protected List<String> textFields() {
        return List.of("name", "cast", "director", "description");
    }
}

package com.app.movie.service;

import com.app.movie.entities.Series;
import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class SeriesService extends TitleService<Series> {

    public SeriesService(MongoTemplate mongo) {
        super(mongo, Series.class, "La serie");
    }

    @Override
    protected List<String> textFields() {
        return List.of("name", "cast", "creator", "description", "episodes.name");
    }
}

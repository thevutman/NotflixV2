package com.app.movie.controller;

import com.app.movie.entities.Movie;
import com.app.movie.service.MovieService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/movie")
public class MovieController extends TitleController<Movie> {

    public MovieController(MovieService service) {
        super(service);
    }
}

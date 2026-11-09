package com.app.movie.controller;

import com.app.movie.entities.Series;
import com.app.movie.service.SeriesService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/series")
public class SeriesController extends TitleController<Series> {

    public SeriesController(SeriesService service) {
        super(service);
    }
}

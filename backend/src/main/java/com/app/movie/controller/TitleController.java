package com.app.movie.controller;

import com.app.movie.dto.ResponseDto;
import com.app.movie.entities.Title;
import com.app.movie.service.TitleService;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

/** The endpoints /api/movie and /api/series share, same verbs as the 2022 controllers. */
public abstract class TitleController<T extends Title> {

    protected final TitleService<T> service;

    protected TitleController(TitleService<T> service) {
        this.service = service;
    }

    @GetMapping("")
    public List<T> get(@RequestParam(required = false) String category, @RequestParam(required = false) String q) {
        return service.get(category, q);
    }

    @GetMapping("/{id}")
    public T getById(@PathVariable String id) {
        return service.getById(id);
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDto create(@RequestBody T request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public T update(@PathVariable String id, @RequestBody T request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @PostMapping("/{id}/play")
    public Map<String, Long> play(@PathVariable String id) {
        return Map.of("views", service.play(id));
    }
}

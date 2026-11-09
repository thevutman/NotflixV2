package com.app.movie.controller;

import com.app.movie.dto.ResponseDto;
import com.app.movie.dto.ScoreCheckDto;
import com.app.movie.dto.ScoreDto;
import com.app.movie.entities.Title;
import com.app.movie.security.CurrentClient;
import com.app.movie.service.ScoreService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/score")
public class ScoreController {

    private final ScoreService service;

    public ScoreController(ScoreService service) {
        this.service = service;
    }

    @GetMapping("")
    public List<Title> myList() {
        return service.myList(CurrentClient.id());
    }

    @GetMapping("/check/{titleId}")
    public ScoreCheckDto check(@PathVariable String titleId) {
        return service.check(CurrentClient.id(), titleId);
    }

    @PostMapping("")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseDto create(@Valid @RequestBody ScoreDto request) {
        return service.create(CurrentClient.id(), request);
    }

    @DeleteMapping("/{titleId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String titleId) {
        service.delete(CurrentClient.id(), titleId);
    }
}

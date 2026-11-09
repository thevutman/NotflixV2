package com.app.movie.controller;

import com.app.movie.dto.ReportDto;
import com.app.movie.service.CatalogService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final CatalogService service;

    public CatalogController(CatalogService service) {
        this.service = service;
    }

    @GetMapping("")
    public CatalogService.Home home() {
        return service.home();
    }

    @GetMapping("/search")
    public CatalogService.Results search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/report")
    public ReportDto report() {
        return service.report();
    }
}

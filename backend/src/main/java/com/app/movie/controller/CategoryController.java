package com.app.movie.controller;

import com.app.movie.entities.Category;
import com.app.movie.exception.ApiException;
import com.app.movie.repository.CategoryRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/category")
public class CategoryController {

    private final CategoryRepository repository;

    public CategoryController(CategoryRepository repository) {
        this.repository = repository;
    }

    @GetMapping("")
    public List<Category> get() {
        return repository.findAllByOrderByOrderAsc();
    }

    @GetMapping("/{slug}")
    public Category getBySlug(@PathVariable String slug) {
        return repository.findBySlug(slug).orElseThrow(() -> ApiException.notFound("La categoría"));
    }
}

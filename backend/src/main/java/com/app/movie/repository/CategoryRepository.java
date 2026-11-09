package com.app.movie.repository;

import com.app.movie.entities.Category;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findAllByOrderByOrderAsc();
    Optional<Category> findBySlug(String slug);
}

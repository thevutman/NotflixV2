package com.app.movie.config;

import com.app.movie.entities.Category;
import com.app.movie.entities.Client;
import com.app.movie.entities.Movie;
import com.app.movie.entities.Series;
import com.app.movie.entities.Title;
import com.app.movie.repository.CategoryRepository;
import com.app.movie.repository.ClientRepository;
import com.app.movie.repository.MovieRepository;
import com.app.movie.repository.SeriesRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.function.Function;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Loads seed/catalog.json on start-up so the app is never empty: a dead database is what
 * killed the 2022 version. Titles are matched by slug, so re-running only updates them and
 * keeps their view counts. It also makes sure the visitor account exists.
 */
@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final AppProperties properties;
    private final ObjectMapper json;
    private final CategoryRepository categories;
    private final MovieRepository movies;
    private final SeriesRepository series;
    private final ClientRepository clients;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(AppProperties properties, ObjectMapper json, CategoryRepository categories,
            MovieRepository movies, SeriesRepository series, ClientRepository clients,
            PasswordEncoder passwordEncoder) {
        this.properties = properties;
        this.json = json;
        this.categories = categories;
        this.movies = movies;
        this.series = series;
        this.clients = clients;
        this.passwordEncoder = passwordEncoder;
    }

    record Catalog(List<Category> categories, List<Movie> movies, List<Series> series) {
    }

    @Override
    public void run(ApplicationArguments args) throws IOException {
        ensureGuest();
        if (!properties.seed()) {
            return;
        }
        Catalog catalog;
        try (InputStream in = new ClassPathResource("seed/catalog.json").getInputStream()) {
            catalog = json.readValue(in, Catalog.class);
        }
        for (Category category : catalog.categories()) {
            categories.findBySlug(category.getSlug()).ifPresent(found -> category.setId(found.getId()));
            categories.save(category);
        }
        upsert(catalog.movies(), movies, slug -> movies.findBySlug(slug).map(Title.class::cast).orElse(null));
        upsert(catalog.series(), series, slug -> series.findBySlug(slug).map(Title.class::cast).orElse(null));
        log.info("Catálogo listo: {} categorías, {} películas, {} series",
                categories.count(), movies.count(), series.count());
    }

    private <T extends Title> void upsert(List<T> titles, MongoRepository<T, String> repository,
            Function<String, Title> bySlug) {
        for (T title : titles) {
            Title existing = bySlug.apply(title.getSlug());
            if (existing != null) {
                title.setId(existing.getId());
                title.setViews(existing.getViews());
            }
            repository.save(title);
        }
    }

    private void ensureGuest() {
        AppProperties.Guest guest = properties.guest();
        if (clients.existsByEmail(guest.email())) {
            return;
        }
        Client client = new Client();
        client.setEmail(guest.email());
        client.setPassword(passwordEncoder.encode(guest.password()));
        client.setName(guest.name());
        client.setLastName("");
        clients.save(client);
    }
}

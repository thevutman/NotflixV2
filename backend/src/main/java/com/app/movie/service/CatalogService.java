package com.app.movie.service;

import com.app.movie.dto.ReportDto;
import com.app.movie.entities.Category;
import com.app.movie.entities.Movie;
import com.app.movie.entities.Series;
import com.app.movie.entities.Title;
import com.app.movie.repository.CategoryRepository;
import com.app.movie.repository.ClientRepository;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;

/** The home screen in one request: on a free server that may be waking up, one call beats five. */
@Service
public class CatalogService {

    private final MovieService movies;
    private final SeriesService series;
    private final CategoryRepository categories;
    private final ClientRepository clients;

    public CatalogService(MovieService movies, SeriesService series, CategoryRepository categories,
            ClientRepository clients) {
        this.movies = movies;
        this.series = series;
        this.categories = categories;
        this.clients = clients;
    }

    public record Home(List<Title> featured, List<Category> categories, List<Movie> movies, List<Series> series) {
    }

    public record Results(List<Movie> movies, List<Series> series) {
    }

    public Home home() {
        List<Movie> allMovies = movies.get(null, null);
        List<Series> allSeries = series.get(null, null);
        List<Title> featured = Stream.concat(allMovies.stream(), allSeries.stream())
                .filter(Title::isFeatured)
                .map(Title.class::cast)
                .toList();
        return new Home(featured, categories.findAllByOrderByOrderAsc(), allMovies, allSeries);
    }

    public Results search(String q) {
        return new Results(movies.get(null, q), series.get(null, q));
    }

    public ReportDto report() {
        List<ReportDto.Entry> top = Stream.concat(movies.mostWatched(10).stream(), series.mostWatched(10).stream())
                .sorted(Comparator.comparingLong(Title::getViews).reversed())
                .limit(10)
                .map(t -> new ReportDto.Entry(t.getId(), t.getSlug(), t.getName(), t.getType().name(), t.getViews()))
                .toList();
        return new ReportDto(movies.count(), series.count(), clients.count(), top);
    }
}

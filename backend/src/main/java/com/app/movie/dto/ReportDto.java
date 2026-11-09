package com.app.movie.dto;

import java.util.List;

/** What the old /report endpoints wanted to be: the most watched titles, counted for real. */
public record ReportDto(long movies, long series, long clients, List<Entry> mostWatched) {

    public record Entry(String id, String slug, String name, String type, long views) {
    }
}

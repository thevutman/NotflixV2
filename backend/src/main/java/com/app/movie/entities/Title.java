package com.app.movie.entities;

import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

/** What movies and series share: the card, the hero and the detail page all read these fields. */
@Getter @Setter
public abstract class Title {

    @Id
    private String id;

    @Indexed(unique = true)
    private String slug;

    private String name;
    private String originalName;
    private String description;
    private String classification;
    private String category;
    private int year;
    private List<String> cast = List.of();
    private String country;

    /** Poster (2:3) and wide backdrop, served by the front end from /posters and /backdrops. */
    private String poster;
    private String backdrop;

    /** Where the public-domain copy comes from, shown on the detail page. */
    private String source;

    private long views;
    private boolean featured;

    public abstract TitleType getType();
}

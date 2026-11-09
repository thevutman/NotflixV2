package com.app.movie.entities;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("movie")
@Getter @Setter
@NoArgsConstructor
public class Movie extends Title {

    private String director;
    private int duration;

    /** Internet Archive identifier; the player embeds archive.org/embed/{video}. */
    private String video;

    @Override
    public TitleType getType() {
        return TitleType.MOVIE;
    }
}

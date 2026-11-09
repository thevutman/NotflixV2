package com.app.movie.entities;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("series")
@Getter @Setter
@NoArgsConstructor
public class Series extends Title {

    private String creator;
    private List<Episode> episodes = List.of();

    @Override
    public TitleType getType() {
        return TitleType.SERIES;
    }

    public int getSeason() {
        return 1;
    }

    @Getter @Setter
    @NoArgsConstructor
    public static class Episode {
        private int number;
        private String name;
        private int year;
        private int duration;
        private String video;
    }
}

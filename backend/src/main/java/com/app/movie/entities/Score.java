package com.app.movie.entities;

import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

/** A "like": the heart on a title. One per viewer and title, which is what "Mi lista" shows. */
@Document("score")
@CompoundIndex(name = "client_title", def = "{'clientId': 1, 'titleId': 1}", unique = true)
@Getter @Setter
@NoArgsConstructor
public class Score {

    @Id
    private String id;

    private Boolean state = true;
    private String clientId;
    private String titleId;
    private TitleType type;

    @CreatedDate
    private Instant createdAt;
}

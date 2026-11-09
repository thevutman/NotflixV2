package com.app.movie.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/** A genre. Titles point to it by its slug, which is also what the URLs use. */
@Document("category")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Category {

    @Id
    private String id;

    @Indexed(unique = true)
    private String slug;

    private String name;
    private String description;
    private int order;
}

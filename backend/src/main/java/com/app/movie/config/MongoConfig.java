package com.app.movie.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/** Fills @CreatedDate fields. */
@Configuration
@EnableMongoAuditing
public class MongoConfig {
}

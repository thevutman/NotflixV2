package com.app.movie.repository;

import com.app.movie.entities.Client;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClientRepository extends MongoRepository<Client, String> {
    Optional<Client> findByEmail(String email);
    boolean existsByEmail(String email);
}

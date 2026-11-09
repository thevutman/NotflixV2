package com.app.movie.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.Instant;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/** A registered viewer. The password is only ever stored as a BCrypt hash. */
@Document("client")
@Getter @Setter
@NoArgsConstructor
public class Client {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String name;
    private String lastName;
    private String birthDate;
    private String phone;
    private Role role = Role.USER;

    @CreatedDate
    private Instant createdAt;

    public enum Role { USER, ADMIN }

    public String fullName() {
        return lastName == null || lastName.isBlank() ? name : name + " " + lastName;
    }
}

package com.app.movie;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/** The whole app against a real (embedded) MongoDB: catalogue, sign-up, login, likes and permissions. */
@SpringBootTest
@AutoConfigureMockMvc
class ApiFlowTests {

    @Autowired
    MockMvc mvc;

    @Autowired
    ObjectMapper json;

    private String register(String email) throws Exception {
        String body = mvc.perform(post("/api/client").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Ana\",\"lastName\":\"Prueba\",\"email\":\"" + email + "\",\"password\":\"secreto123\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return json.readTree(body).get("token").asText();
    }

    @Test
    void catalogueIsSeededAndPublic() throws Exception {
        mvc.perform(get("/api/catalog"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.movies", hasSize(13)))
                .andExpect(jsonPath("$.series", hasSize(3)));
        mvc.perform(get("/api/movie/nosferatu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.director", is("F. W. Murnau")))
                .andExpect(jsonPath("$.type", is("MOVIE")));
        mvc.perform(get("/api/movie").param("q", "keaton"))
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void wrongPasswordIsRejected() throws Exception {
        register("login@test.dev");
        mvc.perform(post("/api/auth").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"user\":\"login@test.dev\",\"password\":\"incorrecta\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status", is(false)));
        mvc.perform(post("/api/auth").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"user\":\"LOGIN@test.dev\",\"password\":\"secreto123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Ana Prueba")));
    }

    @Test
    void likesNeedASessionAndBuildMyList() throws Exception {
        mvc.perform(post("/api/score").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"titleId\":\"nosferatu\",\"type\":\"MOVIE\"}"))
                .andExpect(status().isUnauthorized());

        String token = register("likes@test.dev");
        JsonNode movie = json.readTree(mvc.perform(get("/api/movie/detour")).andReturn().getResponse().getContentAsString());
        String id = movie.get("id").asText();

        for (int i = 0; i < 2; i++) { // liking twice must not duplicate
            mvc.perform(post("/api/score").header("Authorization", "Bearer " + token)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"titleId\":\"" + id + "\",\"type\":\"MOVIE\"}"))
                    .andExpect(status().isCreated());
        }
        mvc.perform(get("/api/score").header("Authorization", "Bearer " + token))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].slug", is("detour")));

        mvc.perform(delete("/api/score/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
        mvc.perform(get("/api/score").header("Authorization", "Bearer " + token))
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void onlyAdminsEditTheCatalogue() throws Exception {
        String token = register("viewer@test.dev");
        mvc.perform(delete("/api/movie/nosferatu").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
        mvc.perform(delete("/api/movie/nosferatu").header("Authorization", "Bearer forged.token.value"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidRegistrationExplainsWhy() throws Exception {
        mvc.perform(post("/api/client").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Ana\",\"email\":\"no-es-email\",\"password\":\"123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(false)));
    }
}

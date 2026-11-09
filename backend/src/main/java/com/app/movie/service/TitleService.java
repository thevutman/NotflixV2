package com.app.movie.service;

import com.app.movie.dto.ResponseDto;
import com.app.movie.entities.Title;
import com.app.movie.exception.ApiException;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;

/**
 * Movies and series behave the same way (list, filter, find, create, update, delete, count a play),
 * so the logic lives here once and MovieService / SeriesService only say which collection to use.
 */
public abstract class TitleService<T extends Title> {

    protected final MongoTemplate mongo;
    private final Class<T> type;
    private final String label;

    protected TitleService(MongoTemplate mongo, Class<T> type, String label) {
        this.mongo = mongo;
        this.type = type;
        this.label = label;
    }

    /** All titles, optionally narrowed to a category slug and/or a text search on name, cast and director. */
    public List<T> get(String category, String q) {
        Query query = new Query().with(Sort.by(Sort.Direction.ASC, "year"));
        if (category != null && !category.isBlank()) {
            query.addCriteria(Criteria.where("category").is(category));
        }
        if (q != null && !q.isBlank()) {
            Pattern text = Pattern.compile(Pattern.quote(q.trim()), Pattern.CASE_INSENSITIVE);
            query.addCriteria(new Criteria().orOperator(textFields().stream()
                    .map(field -> Criteria.where(field).regex(text)).toArray(Criteria[]::new)));
        }
        return mongo.find(query, type);
    }

    protected List<String> textFields() {
        return List.of("name", "cast", "description");
    }

    /** Accepts either the Mongo id or the slug, so links can be readable: /movies/nosferatu. */
    public Optional<T> find(String idOrSlug) {
        Query query = new Query(new Criteria().orOperator(
                Criteria.where("slug").is(idOrSlug), Criteria.where("_id").is(idOrSlug)));
        return Optional.ofNullable(mongo.findOne(query, type));
    }

    public T getById(String idOrSlug) {
        return find(idOrSlug).orElseThrow(() -> ApiException.notFound(label));
    }

    public ResponseDto create(T request) {
        if (mongo.exists(Query.query(Criteria.where("slug").is(request.getSlug())), type)) {
            throw new ApiException(HttpStatus.CONFLICT, label.toUpperCase() + " YA SE ENCUENTRA REGISTRADA");
        }
        request.setId(null);
        request.setViews(0);
        T saved = mongo.save(request);
        return ResponseDto.ok("REGISTRADA EXITOSAMENTE", saved.getId());
    }

    public T update(String id, T request) {
        T current = getById(id);
        request.setId(current.getId());
        request.setViews(current.getViews());
        return mongo.save(request);
    }

    public void delete(String id) {
        mongo.remove(getById(id));
    }

    /** One more view. Atomic, so two people pressing play at once both count. */
    public long play(String idOrSlug) {
        T title = getById(idOrSlug);
        mongo.updateFirst(Query.query(Criteria.where("_id").is(title.getId())), new Update().inc("views", 1), type);
        return title.getViews() + 1;
    }

    public List<T> mostWatched(int limit) {
        return mongo.find(new Query().with(Sort.by(Sort.Direction.DESC, "views")).limit(limit), type);
    }

    public long count() {
        return mongo.count(new Query(), type);
    }
}

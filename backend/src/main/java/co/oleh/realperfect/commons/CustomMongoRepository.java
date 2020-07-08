package co.oleh.realperfect.commons;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface CustomMongoRepository<E, I extends Serializable> extends JpaRepository<E, I> {

    Sort SORT_BY_DISPLAY_ORDER_ASC = new Sort(Sort.Direction.ASC, "displayOrder");

    Sort SORT_BY_SORT_ORDER_ASC = new Sort(Sort.Direction.ASC, "sortOrder");

    Optional<E> findById(I id);

    <T> T findById(String id, Class<T> type);

//    @Query("{ _id : {'$in' : ?0}}")
    Collection<E> findByIdMatches(List<String> ids);
}

package co.oleh.realperfect.commons;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface CrudService<T> {
    <S extends T> S save(S entity);

    List<T> save(List<T> entities);

    Optional<T> findOne(String id);

    Collection<T> findAll();

    void delete(String id);

    default T prepareModelBeforeSave(T model) {
        return model;
    }

    /**
     * By default, works as regular create operation
     *
     * @param existingEntity - entity currently in the database
     * @param updateEntity - updated entity from request
     * @return
     */
    default T update(T existingEntity, T updateEntity) {
        prepareModelBeforeSave(updateEntity);
        return save(updateEntity);
    }
}

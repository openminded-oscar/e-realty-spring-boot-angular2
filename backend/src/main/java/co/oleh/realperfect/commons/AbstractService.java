package co.oleh.realperfect.commons;

import co.oleh.realperfect.commons.CustomMongoRepository;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public class AbstractService<T> implements CrudService<T> {
    protected CustomMongoRepository<T, String> repository;

    public AbstractService(CustomMongoRepository<T, String> repository) {
        this.repository = repository;
    }

    @Override
    public <S extends T> S save(S entity) {
        return repository.save(entity);
    }

    @Override
    public List<T> save(List<T> entities) {
        return repository.save(entities);
    }

    @Override
    public Optional<T> findOne(String id) {
        return repository.findById(id);
    }

    @Override
    public Collection<T> findAll() {
        return repository.findAll();
    }

    @Override
    public void delete(String id) {
        repository.delete(id);
    }
}

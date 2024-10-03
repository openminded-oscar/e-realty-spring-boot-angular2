package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.RealtyObject;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RealtyObjectCrudRepository extends CrudRepository<RealtyObject, Long> {
    List<RealtyObject> findByOwnerId(Long userId);
}

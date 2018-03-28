package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.RealtyObject;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RealtyObjectRepository extends CrudRepository<RealtyObject, Long>,
        JpaSpecificationExecutor {

}

package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.RealtyObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RealtyObjectRepository extends JpaRepository<RealtyObject, Long>,
        JpaSpecificationExecutor<RealtyObject> {

}

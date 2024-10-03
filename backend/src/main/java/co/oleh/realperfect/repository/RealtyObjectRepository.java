package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.OperationType;
import co.oleh.realperfect.model.RealtyObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RealtyObjectRepository extends JpaRepository<RealtyObject, Long>,
        JpaSpecificationExecutor<RealtyObject> {
    List<RealtyObject> findRealtyObjectByTargetOperationsContaining(OperationType operationType);

    List<RealtyObject> findByOwnerId(Long userId);
}

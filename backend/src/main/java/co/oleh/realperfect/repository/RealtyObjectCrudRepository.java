package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.RealtyObjectStatus;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface RealtyObjectCrudRepository extends CrudRepository<RealtyObject, Long> {
    List<RealtyObject> findByOwnerId(Long userId);
    @Transactional
    @Modifying
    @Query("UPDATE RealtyObject r SET r.status = :status WHERE r.id = :id")
    int updateRealtyObjectStatusById(@Param("id") Long id, @Param("status") RealtyObjectStatus status);

    @Query(value = "SELECT * FROM tbl_realty_object r WHERE status='ACTIVE' AND ST_Distance_Sphere(r.geolocation, ST_GeomFromText(:point)) <= :radius ORDER BY ST_Distance_Sphere(r.geolocation, ST_GeomFromText(:point)) ASC",
            nativeQuery = true)
    List<RealtyObject> findWithinRadius(@Param("point") String pointWKT, @Param("radius") double radius);
}

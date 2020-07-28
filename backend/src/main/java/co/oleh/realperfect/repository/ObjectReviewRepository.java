package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.ObjectReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ObjectReviewRepository extends JpaRepository<ObjectReview, Long> {
    List<ObjectReview> findByUserId(Long userId);
    List<ObjectReview> findByRealtyObjId(Long realtyObjId);
    List<ObjectReview> findByUserIdAndRealtyObjId(Long userId, Long realtyObjId);
    ObjectReview findByUserIdAndRealtyObjIdAndDateTimeGreaterThan(Long userId, Long realtyObjId, LocalDateTime minDateTime);
}

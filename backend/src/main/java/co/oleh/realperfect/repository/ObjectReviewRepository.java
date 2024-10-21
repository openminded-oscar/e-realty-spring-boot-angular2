package co.oleh.realperfect.repository;

import co.oleh.realperfect.mapping.ObjectReviewDto;
import co.oleh.realperfect.model.ObjectReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;

@Repository
public interface ObjectReviewRepository extends JpaRepository<ObjectReview, Long> {
    List<ObjectReview> findByUserIdOrderByDateTimeDesc(Long userId);
    List<ObjectReview> findByRealtyObjId(Long realtyObjId);
    List<ObjectReview> findByRealtyObjIdAndDateTimeBetween(Long realtyObjId, Instant start, Instant end);
    List<ObjectReview> findByRealtyObjIdAndDateTimeAfter(Long realtyObjId, Instant dateTime);
    List<ObjectReview> findByUserIdAndRealtyObjId(Long userId, Long realtyObjId);
    ObjectReview findByUserIdAndRealtyObjIdAndDateTimeGreaterThan(Long userId, Long realtyObjId, Instant minDateTime);
    List<ObjectReview> findByRealtorId(Long realterId);
}

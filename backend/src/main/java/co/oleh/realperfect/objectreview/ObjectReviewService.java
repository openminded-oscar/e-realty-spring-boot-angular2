package co.oleh.realperfect.objectreview;

import co.oleh.realperfect.model.ObjectReview;
import co.oleh.realperfect.repository.ObjectReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class ObjectReviewService {
    private ObjectReviewRepository objectReviewRepository;


    public ObjectReview save(ObjectReview objectReview) {
        return objectReviewRepository.save(objectReview);
    }

    public ObjectReview remove(ObjectReview objectReview) {
        objectReviewRepository.deleteById(objectReview.getId());
        return objectReview;
    }

    public List<ObjectReview> remove(List<ObjectReview> objectReviews) {
        for(ObjectReview objectReview: objectReviews) {
            objectReviewRepository.deleteById(objectReview.getId());
        }

        return objectReviews;
    }

    public List<ObjectReview> findReviewForUserAndObject(Long userId, Long objectId) {
        return objectReviewRepository.findByUserIdAndRealtyObjId(userId, objectId);
    }

    public ObjectReview findFutureReviewForUserAndObject(Long userId, Long objectId) {
        return objectReviewRepository.findByUserIdAndRealtyObjIdAndDateTimeGreaterThan(userId, objectId, LocalDateTime.now());
    }

    public List<ObjectReview> findReviewsForUser(Long userId) {
        return objectReviewRepository.findByUserId(userId);
    }

    public List<ObjectReview> findReviewsForObject(Long realtyObjId) {
        return objectReviewRepository.findByRealtyObjId(realtyObjId);
    }

    public ObjectReview findById(Long objectId) {
        return objectReviewRepository.findById(objectId).get();
    }
}

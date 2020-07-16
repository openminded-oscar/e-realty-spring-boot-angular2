package co.oleh.realperfect.objectreview;

import co.oleh.realperfect.model.ObjectReview;
import co.oleh.realperfect.repository.ObjectReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ObjectReviewService {
    private ObjectReviewRepository objectReviewRepository;


    public ObjectReview save(ObjectReview objectReview) {
        return objectReviewRepository.save(objectReview);
    }

    public ObjectReview remove(ObjectReview objectReview) {
        objectReviewRepository.delete(objectReview.getId());
        return objectReview;
    }

    public ObjectReview findReviewForUserAndObject(Long userId, Long objectId) {
        return objectReviewRepository.findByUserIdAndRealtyObjId(userId, objectId);
    }

    public List<ObjectReview> findReviewsForUser(Long userId) {
        return objectReviewRepository.findByUserId(userId);
    }

    public List<ObjectReview> findReviewsForObject(Long realtyObjId) {
        return objectReviewRepository.findByRealtyObjId(realtyObjId);
    }

    public ObjectReview findById(Long objectId) {
        return objectReviewRepository.findOne(objectId);
    }
}

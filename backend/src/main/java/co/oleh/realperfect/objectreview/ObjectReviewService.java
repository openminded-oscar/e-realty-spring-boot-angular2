package co.oleh.realperfect.objectreview;

import co.oleh.realperfect.mapping.MappingService;
import co.oleh.realperfect.mapping.ObjectReviewDto;
import co.oleh.realperfect.mapping.ObjectReviewDetailsForUserDto;
import co.oleh.realperfect.model.ObjectReview;
import co.oleh.realperfect.repository.ObjectReviewRepository;
import co.oleh.realperfect.repository.RealtyObjectRepository;
import co.oleh.realperfect.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ObjectReviewService {
    private final RealtyObjectRepository realtyObjectRepository;
    private UserRepository userRepository;
    private ObjectReviewRepository objectReviewRepository;
    private MappingService mappingService;


    public ObjectReviewDto save(ObjectReviewDto objectReview) {
        ObjectReview objectReviewEntity = mappingService.map(objectReview, ObjectReview.class);

        objectReviewEntity.setUser(userRepository.findById(objectReview.getUserId()).get());
        objectReviewEntity.setRealtyObj(realtyObjectRepository.findById(objectReview.getRealtyObjId()).get());

        objectReviewRepository.save(objectReviewEntity);

        return objectReview;
    }

    public ObjectReview remove(ObjectReview objectReview) {
        objectReviewRepository.deleteById(objectReview.getId());
        return objectReview;
    }

    public List<ObjectReview> remove(List<ObjectReview> objectReviews) {
        for (ObjectReview objectReview : objectReviews) {
            objectReviewRepository.deleteById(objectReview.getId());
        }

        return objectReviews;
    }

    public List<ObjectReview> findReviewForUserAndObject(Long userId, Long objectId) {
        return objectReviewRepository.findByUserIdAndRealtyObjId(userId, objectId);
    }

    public ObjectReviewDto findFutureReviewForUserAndObject(Long userId, Long objectId) {
        ObjectReview objectReview =
                objectReviewRepository.findByUserIdAndRealtyObjIdAndDateTimeGreaterThan(userId, objectId, Instant.now());

        return this.mappingService.map(objectReview, ObjectReviewDto.class);
    }

    public List<ObjectReviewDetailsForUserDto> findReviewsForUser(Long userId) {
        List<ObjectReview> objectReviews = objectReviewRepository.findByUserIdOrderByDateTimeDesc(userId);
        return objectReviews.stream()
                .map(objectReview -> this.mappingService.map(objectReview, ObjectReviewDetailsForUserDto.class))
                .collect(Collectors.toList());
    }

    public List<ObjectReview> findReviewsForObject(Long realtyObjId) {
        return objectReviewRepository.findByRealtyObjId(realtyObjId);
    }

    public ObjectReview findById(Long objectId) {
        return objectReviewRepository.findById(objectId).get();
    }
}

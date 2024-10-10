package co.oleh.realperfect.objectreview;

import co.oleh.realperfect.mapping.MappingService;
import co.oleh.realperfect.mapping.ObjectReviewDto;
import co.oleh.realperfect.mapping.MyObjectReviewDto;
import co.oleh.realperfect.model.ObjectReview;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.repository.ObjectReviewRepository;
import co.oleh.realperfect.repository.RealtyObjectRepository;
import co.oleh.realperfect.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ObjectReviewService {
    private final RealtyObjectRepository realtyObjectRepository;
    private UserRepository userRepository;
    private ObjectReviewRepository objectReviewRepository;
    private MappingService mappingService;


    public MyObjectReviewDto save(ObjectReviewDto objectReview) {
        ObjectReview objectReviewEntity = mappingService.map(objectReview, ObjectReview.class);
        RealtyObject realtyObject = realtyObjectRepository.findById(objectReview.getRealtyObjId()).get();
        User user = userRepository.findById(objectReview.getUserId()).get();

        objectReviewEntity.setUser(user);
        objectReviewEntity.setRealtyObj(realtyObject);

        ObjectReview savedEntity = objectReviewRepository.save(objectReviewEntity);

        return mappingService.map(savedEntity, MyObjectReviewDto.class);
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


    public List<MyObjectReviewDto> findReviewsForUser(Long userId) {
        List<ObjectReview> objectReviews = objectReviewRepository.findByUserIdOrderByDateTimeDesc(userId);
        return objectReviews.stream()
                .map(objectReview -> this.mappingService.map(objectReview, MyObjectReviewDto.class))
                .collect(Collectors.toList());
    }

    public List<ObjectReviewDto> findReviewsForObjectAndDate(Long realtyObjId, LocalDateTime dateTime) {
        List<ObjectReview> reviews = objectReviewRepository
                .findByRealtyObjIdAndDateTimeBetween(realtyObjId, null, null);

        return reviews.stream().map(review -> this.mappingService.map(review, ObjectReviewDto.class)).collect(Collectors.toList());
    }

    public List<ObjectReviewDto> findReviewsForObject(Long realtyObjId) {
        List<ObjectReview> reviews = objectReviewRepository.findByRealtyObjId(realtyObjId);

        return reviews.stream().map(review -> this.mappingService.map(review, ObjectReviewDto.class)).collect(Collectors.toList());
    }

    public ObjectReview findById(Long objectId) {
        return objectReviewRepository.findById(objectId).get();
    }
}

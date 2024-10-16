package co.oleh.realperfect.objectreview;

import co.oleh.realperfect.mapping.ObjectReviewDto;
import co.oleh.realperfect.mapping.MyObjectReviewDto;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.model.ObjectReview;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.repository.ObjectReviewRepository;
import co.oleh.realperfect.repository.RealtyObjectRepository;
import co.oleh.realperfect.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ObjectReviewService {
    public static final int OBJECT_REVIEW_START_HOUR = 10;
    public static final int OBJECT_REVIEW_END_HOUR = 20;

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

    public List<ObjectReview> findReviewsForObjectAndDate(Long realtyObjId, ZonedDateTime zonedDateTime) {
        // day limits timestamp
        Instant startOfDay = zonedDateTime.with(LocalTime.MIN).toInstant();
        Instant endOfDay = zonedDateTime.with(LocalTime.MAX).toInstant();

        return new ArrayList<>(this.objectReviewRepository
                .findByRealtyObjIdAndDateTimeBetween(realtyObjId, startOfDay, endOfDay));
    }

    public List<Instant> timeslotsForObjectAndDate(Long realtyObjId, ZonedDateTime zonedDateTime) {
        List<Instant> busyTimes = this.findReviewsForObjectAndDate(realtyObjId, zonedDateTime)
                .stream()
                .map(ObjectReview::getDateTime)
                .collect(Collectors.toList());

        Instant houseOpeningTime =
                zonedDateTime.withHour(ObjectReviewService.OBJECT_REVIEW_START_HOUR).toInstant();
        Instant houseClosingTime =
                zonedDateTime.withHour(ObjectReviewService.OBJECT_REVIEW_END_HOUR).toInstant();


        List<Instant> availableSlots = new ArrayList<>();
        Instant currentHourToCheck = houseOpeningTime;
        Instant twoHoursFromNow = Instant.now().plus(2, ChronoUnit.HOURS);
        while (houseClosingTime.isAfter(currentHourToCheck)) {
            if (currentHourToCheck.isBefore(twoHoursFromNow)) {
                break;
            }
            if (!busyTimes.contains(currentHourToCheck) &&
                    currentHourToCheck.isAfter(Instant.now())) {
                availableSlots.add(currentHourToCheck);
            }
            currentHourToCheck = currentHourToCheck.plus(1, ChronoUnit.HOURS);
        }

        return availableSlots;
    }

    public List<ObjectReviewDto> findReviewsForObject(Long realtyObjId) {
        List<ObjectReview> reviews = objectReviewRepository.findByRealtyObjId(realtyObjId);

        return reviews.stream().map(review -> this.mappingService.map(review, ObjectReviewDto.class)).collect(Collectors.toList());
    }

    public ObjectReview findById(Long objectId) {
        return objectReviewRepository.findById(objectId).get();
    }
}

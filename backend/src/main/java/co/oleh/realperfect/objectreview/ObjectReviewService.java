package co.oleh.realperfect.objectreview;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.emails.EmailSenderService;
import co.oleh.realperfect.mapping.MyObjectReviewDto;
import co.oleh.realperfect.mapping.ObjectReviewDto;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.model.ObjectReview;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.repository.ObjectReviewRepository;
import co.oleh.realperfect.repository.RealtyObjectCrudRepository;
import co.oleh.realperfect.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@AllArgsConstructor
public class ObjectReviewService {
    public static final int OBJECT_REVIEW_START_HOUR = 10;
    public static final int OBJECT_REVIEW_END_HOUR = 20;
    public static final int OBJECT_REVIEW_DURATION_MINUTES = 30;

    private final RealtyObjectCrudRepository realtyObjectRepository;

    private EmailSenderService emailService;
    private UserRepository userRepository;
    private ObjectReviewRepository objectReviewRepository;
    private MappingService mappingService;

    public MyObjectReviewDto save(ObjectReviewDto objectReview) {
        // mao dto to object review
        verifyNoOverlappingReview(objectReview);
        ObjectReview objectReviewEntity = mappingService.map(objectReview, ObjectReview.class);

        //save review
        RealtyObject realtyObject = realtyObjectRepository.findById(objectReview.getRealtyObjId()).get();
        User user = userRepository.findById(objectReview.getUserId()).get();

        objectReviewEntity.setRealtor(realtyObject.getRealtor());
        objectReviewEntity.setUser(user);
        objectReviewEntity.setRealtyObj(realtyObject);
        ObjectReview savedEntity = objectReviewRepository.save(objectReviewEntity);

        // emails sending
        objectReview.setId(savedEntity.getId());
        emailService.sendObjectReviewSetForUserAsync(user, objectReview, realtyObject, realtyObject.getRealtor());
        emailService.sendObjectReviewSetForRealtorAsync(user, objectReview, realtyObject, realtyObject.getRealtor());

        return mappingService.map(savedEntity, MyObjectReviewDto.class);
    }

    private void verifyNoOverlappingReview(ObjectReviewDto objectReview) {
//      Next step is using @Lock(LockModeType.PESSIMISTIC_WRITE) in repo level (do we need it???)
        Instant beginTime = objectReview.getDateTime();
        Instant endTime = beginTime.plus(OBJECT_REVIEW_DURATION_MINUTES, ChronoUnit.MINUTES);
        List<ObjectReview> overlappingReviews =
                objectReviewRepository.findByRealtyObjIdAndDateTimeBetween(objectReview.getRealtyObjId(), beginTime,
                        endTime);
        if (!overlappingReviews.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Object review already exists");
        }
    }

    public List<ObjectReview> remove(List<ObjectReview> objectReviews, SpringSecurityUser user) {
        User userFromDb = userRepository.findById(user.getId()).get();

        for (ObjectReview objectReview : objectReviews) {
            Realtor realtor = objectReview.getRealtor();
            RealtyObject realtyObject = objectReview.getRealtyObj();

            objectReviewRepository.deleteById(objectReview.getId());

            emailService.sendObjectReviewCancelAsync(userFromDb, objectReview, realtyObject, realtor);
        }

        return objectReviews;
    }

    @Transactional
    public int approveReviewById(Long objectReviewId) {
        return objectReviewRepository.updateApprovedStatus(objectReviewId, true);
    }

    public ObjectReviewDto findReviewById(Long objectReviewId) {
        ObjectReview objectReview =
                objectReviewRepository.findById(objectReviewId).get();

        return this.mappingService.map(objectReview, ObjectReviewDto.class);
    }

    public List<ObjectReview> findReviewForUserAndObject(Long userId, Long objectId) {
        return objectReviewRepository.findByUserIdAndRealtyObjId(userId, objectId);
    }

    public ObjectReviewDto findFutureReviewForUserAndObject(Long userId, Long objectId) {
        ObjectReview objectReview =
                objectReviewRepository.findByUserIdAndRealtyObjIdAndDateTimeGreaterThan(userId, objectId,
                        Instant.now());

        return this.mappingService.map(objectReview, ObjectReviewDto.class);
    }


    public List<MyObjectReviewDto> findReviewsForUser(Long userId) {
        List<ObjectReview> objectReviews = objectReviewRepository.findByUserIdOrderByDateTimeDesc(userId);
        return objectReviews.stream()
                .map(objectReview -> this.mappingService.map(objectReview, MyObjectReviewDto.class))
                .collect(Collectors.toList());
    }

    public List<MyObjectReviewDto> findReviewsForObjectRealtor(Long realtorId) {
        List<ObjectReview> objectReviews = this.objectReviewRepository.findByRealtorId(realtorId);
        objectReviews.sort(Comparator.nullsLast(Comparator.comparing(ObjectReview::getDateTime).reversed()));

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

    public void deleteReviewById(Long reviewId) {
        // TODO verify user
        this.objectReviewRepository.deleteById(reviewId);
    }
}

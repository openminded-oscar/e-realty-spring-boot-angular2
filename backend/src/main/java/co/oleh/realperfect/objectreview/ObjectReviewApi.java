package co.oleh.realperfect.objectreview;


import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.calendar.GoogleCalendarWrapperService;
import co.oleh.realperfect.ratelimiter.RateLimited;
import co.oleh.realperfect.mapping.ObjectReviewDto;
import co.oleh.realperfect.mapping.MyObjectReviewDto;
import co.oleh.realperfect.model.ObjectReview;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.realtor.RealtorService;
import jakarta.annotation.security.RolesAllowed;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping(value = "/api/object-review")
@AllArgsConstructor
public class ObjectReviewApi {
    private static final Logger LOGGER = LoggerFactory.
            getLogger(ObjectReviewApi.class);

    private ObjectReviewService reviewService;
    private GoogleCalendarWrapperService googleCalendarWrapperService;
    private RealtorService realtorService;

    @GetMapping(value = "/my-reviews-list")
    public ResponseEntity<List<MyObjectReviewDto>> findReviewsForUser(@AuthenticationPrincipal SpringSecurityUser user) {
        Long userId = user.getId();
        List<MyObjectReviewDto> objectReviewDtos = reviewService.findReviewsForUser(userId);
        return new ResponseEntity<>(objectReviewDtos, HttpStatus.OK);
    }

    @GetMapping(value = "/slots-for-object/{realtyObjId}/{date}")
    public ResponseEntity<List<Instant>>
    findReviewsForObject(@PathVariable Long realtyObjId,
                         @PathVariable Instant date,
                         @RequestParam String timezone) {
        ZonedDateTime zonedDateTime = date.atZone(ZoneId.of(timezone));

        List<Instant> objectReviewDtos = reviewService.timeslotsForObjectAndDate(
                realtyObjId, zonedDateTime
        );

        return new ResponseEntity<>(objectReviewDtos, HttpStatus.OK);
    }

    @PostMapping
    @RateLimited(requestsPerMinute = 5)
    public ResponseEntity<MyObjectReviewDto> saveReview(@AuthenticationPrincipal SpringSecurityUser user,
                                                        @RequestBody ObjectReviewDto reviewDto) throws IOException {
        reviewDto.setUserId(user.getId());
        if (reviewService.findFutureReviewForUserAndObject(user.getId(), reviewDto.getRealtyObjId()) != null) {
            throw new RuntimeException("There is already such review");
        }
        googleCalendarWrapperService.addReviewToUserCalendar(reviewDto, user);

        MyObjectReviewDto addedReview = reviewService.save(reviewDto);

        return new ResponseEntity<>(addedReview, HttpStatus.OK);
    }

    @PostMapping(value = "/{reviewId}/approve")
    @RolesAllowed({"REALTOR", "ADMIN"})
    public ResponseEntity<Boolean> approveReviewById(@AuthenticationPrincipal SpringSecurityUser user,
                                                     @PathVariable Long reviewId) {
        Objects.requireNonNull(user, "User must not be null");
        Boolean approved = this.reviewService.approveReviewById(reviewId) > 0;
        return new ResponseEntity<>(approved, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Boolean> removeReviewById(@AuthenticationPrincipal SpringSecurityUser user,
                                                    @PathVariable Long reviewId) {
        reviewService.deleteReviewById(reviewId);

        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    @DeleteMapping(value = "/by-object/{realtyObjId}")
    public ResponseEntity<List<ObjectReview>> removeReviewsForObject(@AuthenticationPrincipal SpringSecurityUser user,
                                                                     @PathVariable Long realtyObjId) {
        Long userId = user.getId();

        List<ObjectReview> reviews = reviewService.findReviewForUserAndObject(userId, realtyObjId);
        List<ObjectReview> removedReviews = reviewService.remove(reviews, user);

        return new ResponseEntity<>(removedReviews, HttpStatus.OK);
    }

    @GetMapping(value = "/{reviewId}")
    public ResponseEntity<ObjectReviewDto> getReviewById(@AuthenticationPrincipal SpringSecurityUser user,
                                                                     @PathVariable Long reviewId) {
        ObjectReviewDto objectReview = reviewService.findReviewById(reviewId);
        return new ResponseEntity<>(objectReview, HttpStatus.OK);
    }

    @GetMapping(value = "/by-object/{realtyObjId}")
    public ResponseEntity<ObjectReviewDto> getReviewForObjectAndUser(@AuthenticationPrincipal SpringSecurityUser user,
                                                                     @PathVariable Long realtyObjId) {
        ObjectReviewDto objectReview = reviewService.findFutureReviewForUserAndObject(user.getId(), realtyObjId);
        return new ResponseEntity<>(objectReview, HttpStatus.OK);
    }

    @GetMapping(value = "/my-as-realtor")
    public ResponseEntity<List<MyObjectReviewDto>> getReviewsForRealtor(@AuthenticationPrincipal SpringSecurityUser user) {
        Realtor realtor = this.realtorService.findRealtorByUserId(user.getId());

        List<MyObjectReviewDto> objectReviews = this.reviewService.findReviewsForObjectRealtor(realtor.getId());

        return new ResponseEntity<>(objectReviews, HttpStatus.OK);
    }
}

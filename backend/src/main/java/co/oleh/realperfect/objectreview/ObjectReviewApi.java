package co.oleh.realperfect.objectreview;


import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.calendar.GoogleCalendarWrapperService;
import co.oleh.realperfect.mapping.ObjectReviewDto;
import co.oleh.realperfect.mapping.MyObjectReviewDto;
import co.oleh.realperfect.model.ObjectReview;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(value = "/api/object-review")
@AllArgsConstructor
public class ObjectReviewApi {
    private static final Logger LOGGER = LoggerFactory.
            getLogger(ObjectReviewApi.class);

    private ObjectReviewService reviewService;
    private GoogleCalendarWrapperService googleCalendarWrapperService;

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
    public ResponseEntity<MyObjectReviewDto> saveReview(@AuthenticationPrincipal SpringSecurityUser user, @RequestBody ObjectReviewDto review) throws IOException {
        if (reviewService.findFutureReviewForUserAndObject(user.getId(), review.getRealtyObjId()) != null) {
            throw new RuntimeException("There is already such review");
        }
        review.setUserId(user.getId());

        Event event = constructEventForObjectReview(review);
        googleCalendarWrapperService.addEventToPrimaryCalendar(event);

        return new ResponseEntity<>(reviewService.save(review), HttpStatus.OK);
    }

    @GetMapping(value = "/{realtyObjId}")
    public ResponseEntity<ObjectReviewDto> getReviewForObjectAndUser(@AuthenticationPrincipal SpringSecurityUser user,
                                                                     @PathVariable Long realtyObjId) {
        ObjectReviewDto objectReview = reviewService.findFutureReviewForUserAndObject(user.getId(), realtyObjId);
        return new ResponseEntity<>(objectReview, HttpStatus.OK);
    }

    @DeleteMapping(value = "/{realtyObjId}")
    public ResponseEntity<List<ObjectReview>> removeReviews(@AuthenticationPrincipal SpringSecurityUser user,
                                                            @PathVariable Long realtyObjId) {
        Long userId = user.getId();
        List<ObjectReview> reviews = reviewService.findReviewForUserAndObject(userId, realtyObjId);
        return new ResponseEntity<>(reviewService.remove(reviews), HttpStatus.OK);
    }

    private Event constructEventForObjectReview(ObjectReviewDto review) {
        Event event = new Event();
        event.setSummary("Realty review from RealPerfect");
        event.setDescription("Please make sure to be on time!");
        Date startDateTime = Date.from(review.getDateTime().atZone(ZoneId.systemDefault()).toInstant());
        Instant plusOneHour = review.getDateTime()
                .atZone(ZoneId.systemDefault())  // Convert to ZonedDateTime using the system default zone
                .plusHours(1)                    // Add 1 hour
                .toInstant();                    // Convert back to Instant
        Date endDateTime = Date.from(plusOneHour);
        event.setStart(new EventDateTime().setDateTime(new DateTime(startDateTime)));
        event.setEnd(new EventDateTime().setDateTime(new DateTime(endDateTime)));

        return event;
    }
}

package co.oleh.realperfect.objectreview;


import co.oleh.realperfect.calendar.GoogleCalendarWrapperService;
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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(value = "/api/object-review")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ObjectReviewApi {
    private static final Logger LOGGER = LoggerFactory.
            getLogger(ObjectReviewApi.class);

    private ObjectReviewService reviewService;
    private GoogleCalendarWrapperService googleCalendarWrapperService;

    @GetMapping(value = "/user/{userId}")
    public ResponseEntity<List<ObjectReview>> findReviewsForUser(@PathVariable(required = false) Long userId) {
        return new ResponseEntity<>(reviewService.findReviewsForUser(userId), HttpStatus.OK);
    }

    @GetMapping(value = "/object/{realtyObjId}")
    public ResponseEntity<List<ObjectReview>> findReviewsForObject(@PathVariable(required = false) Long realtyObjId) {
        return new ResponseEntity<>(reviewService.findReviewsForUser(realtyObjId), HttpStatus.OK);
    }

    @GetMapping(value = "/{userId}/{realtyObjId}")
    public ResponseEntity<ObjectReview> getReview(@AuthenticationPrincipal UserDetails user,
                                                  @PathVariable Long userId,
                                                  @PathVariable Long realtyObjId) {
        return new ResponseEntity<>(reviewService.findFutureReviewForUserAndObject(userId, realtyObjId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ObjectReview> saveReview(@RequestBody ObjectReview review) throws IOException {
        if(reviewService.findFutureReviewForUserAndObject(review.getUserId(), review.getRealtyObjId()) != null) {
            throw new RuntimeException("There is already such review");
        }

        Event event = constructEventForObjectReview(review);
        googleCalendarWrapperService.addEventToPrimaryCalendar(event);
        return new ResponseEntity<>(reviewService.save(review), HttpStatus.OK);
    }

    @DeleteMapping(value = "/{userId}/{realtyObjId}")
    public ResponseEntity<List<ObjectReview>> removeReviews(@PathVariable Long userId, @PathVariable Long realtyObjId) {
        List<ObjectReview> reviews = reviewService.findReviewForUserAndObject(userId, realtyObjId);
        return new ResponseEntity<>(reviewService.remove(reviews), HttpStatus.OK);
    }

    private Event constructEventForObjectReview(ObjectReview review) {
        Event event = new Event();
        event.setSummary("Realty review from RealPerfect");
        event.setDescription("Please make sure to be on time!");
        Date startDateTime = Date.from(review.getDateTime().atZone(ZoneId.systemDefault()).toInstant());
        Date endDateTime = Date.from(review.getDateTime().plusHours(1).atZone(ZoneId.systemDefault()).toInstant());
        event.setStart(new EventDateTime().setDateTime(new DateTime(startDateTime)));
        event.setEnd(new EventDateTime().setDateTime(new DateTime(endDateTime)));

        return event;
    }
}

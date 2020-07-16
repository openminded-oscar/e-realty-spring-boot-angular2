package co.oleh.realperfect.objectreview;


import co.oleh.realperfect.model.ObjectReview;
import lombok.AllArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/object-review")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ObjectReviewApi {
    private static final Logger LOGGER = Logger.
            getLogger(ObjectReviewApi.class);

    private ObjectReviewService reviewService;

    @GetMapping(value = "/user/{userId}")
    public ResponseEntity<List<ObjectReview>> findReviewsForUser(@PathVariable(required = false) Long userId) {
        return new ResponseEntity<>(reviewService.findReviewsForUser(userId), HttpStatus.OK);
    }

    @GetMapping(value = "/object/{realtyObjId}")
    public ResponseEntity<List<ObjectReview>> findReviewsForObject(@PathVariable(required = false) Long realtyObjId) {
        return new ResponseEntity<>(reviewService.findReviewsForUser(realtyObjId), HttpStatus.OK);
    }

    @GetMapping(value = "/{userId}/{realtyObjId}")
    public ResponseEntity<ObjectReview> getReview(@PathVariable Long userId, @PathVariable Long realtyObjId) {
        return new ResponseEntity<>(reviewService.findReviewForUserAndObject(userId, realtyObjId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ObjectReview> saveReview(@RequestBody ObjectReview interest) {
        if(reviewService.findReviewForUserAndObject(interest.getUserId(), interest.getRealtyObjId()) != null) {
            throw new RuntimeException("There is already such review");
        }
        return new ResponseEntity<>(reviewService.save(interest), HttpStatus.OK);
    }

    @DeleteMapping(value = "/{userId}/{realtyObjId}")
    public ResponseEntity<ObjectReview> removeReview(@PathVariable Long userId, @PathVariable Long realtyObjId) {
        ObjectReview interest = reviewService.findReviewForUserAndObject(userId, realtyObjId);
        return new ResponseEntity<>(reviewService.remove(interest), HttpStatus.OK);
    }
}

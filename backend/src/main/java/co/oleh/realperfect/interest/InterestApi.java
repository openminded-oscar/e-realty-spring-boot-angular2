package co.oleh.realperfect.interest;


import co.oleh.realperfect.model.Interest;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/interest")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class InterestApi {
    private static final Logger LOGGER = LoggerFactory.
            getLogger(InterestApi.class);

    private InterestService interestService;

    @GetMapping(value = "/{userId}")
    public ResponseEntity<List<Interest>> findInterestsForUser(@PathVariable(required = false) Long userId) {
        return new ResponseEntity<>(interestService.findInterestsForUser(userId), HttpStatus.OK);
    }

    @GetMapping(value = "/{userId}/{realtyObjId}")
    public ResponseEntity<Interest> getInterest(@PathVariable Long userId, @PathVariable Long realtyObjId) {
        return new ResponseEntity<>(interestService.findInterestForUserAndObject(userId, realtyObjId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Interest> saveInterest(@RequestBody Interest interest) {
        if(interestService.findInterestForUserAndObject(interest.getUserId(), interest.getRealtyObjId()) != null) {
            throw new RuntimeException("There is already such interest");
        }
        return new ResponseEntity<>(interestService.save(interest), HttpStatus.OK);
    }

    @DeleteMapping(value = "/{userId}/{realtyObjId}")
    public ResponseEntity<Interest> removeInterest(@PathVariable Long userId, @PathVariable Long realtyObjId) {
        Interest interest = interestService.findInterestForUserAndObject(userId, realtyObjId);
        return new ResponseEntity<>(interestService.remove(interest), HttpStatus.OK);
    }
}

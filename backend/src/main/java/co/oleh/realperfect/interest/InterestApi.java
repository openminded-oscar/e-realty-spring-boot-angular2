package co.oleh.realperfect.interest;


import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.model.Interest;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @GetMapping(value = "/")
    public ResponseEntity<List<Interest>> findInterestsForUser(@AuthenticationPrincipal SpringSecurityUser user) {
        Long userId = user.getId();
        return new ResponseEntity<>(interestService.findInterestsForUser(userId), HttpStatus.OK);
    }

    @GetMapping(value = "/{realtyObjId}")
    public ResponseEntity<Interest> getInterest(@AuthenticationPrincipal SpringSecurityUser user, @PathVariable Long realtyObjId) {
        Long userId = user.getId();
        return new ResponseEntity<>(interestService.findInterestForUserAndObject(userId, realtyObjId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Interest> saveInterest(@RequestBody Interest interest) {
        if (interestService.findInterestForUserAndObject(interest.getUserId(), interest.getRealtyObjId()) != null) {
            throw new RuntimeException("There is already such interest");
        }
        return new ResponseEntity<>(interestService.save(interest), HttpStatus.OK);
    }

    @DeleteMapping(value = "/{realtyObjId}")
    public ResponseEntity<Interest> removeInterest(@AuthenticationPrincipal SpringSecurityUser user, @PathVariable Long realtyObjId) {
        Long userId = user.getId();
        Interest interest = interestService.findInterestForUserAndObject(userId, realtyObjId);
        return new ResponseEntity<>(interestService.remove(interest), HttpStatus.OK);
    }
}

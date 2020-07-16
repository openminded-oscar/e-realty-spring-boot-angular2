package co.oleh.realperfect.interest;

import co.oleh.realperfect.model.Interest;
import co.oleh.realperfect.repository.InterestRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class InterestService {
    private InterestRepository interestRepository;


    public Interest save(Interest interest) {
        return interestRepository.save(interest);
    }

    public Interest remove(Interest interest) {
        interestRepository.delete(interest.getId());
        return interest;
    }

    public Interest findInterestForUserAndObject(Long userId, Long objectId) {
        return interestRepository.findByUserIdAndRealtyObjId(userId, objectId);
    }

    public List<Interest> findInterestsForUser(Long userId) {
        return interestRepository.findByUserId(userId);
    }

    public Interest findById(Long objectId) {
        return interestRepository.findOne(objectId);
    }
}

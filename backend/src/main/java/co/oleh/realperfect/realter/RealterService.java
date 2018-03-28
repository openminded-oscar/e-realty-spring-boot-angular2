package co.oleh.realperfect.realter;

import co.oleh.realperfect.repository.RealterRepository;
import co.oleh.realperfect.model.Realter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RealterService {
    @Autowired
    private RealterRepository realterRepository;

    public Iterable<Realter> findByNameOrSurnameLike(String query) {
        Iterable<Realter> realters = realterRepository.
                findByUser_NameStartingWithOrUser_SurnameStartingWith(query, query);

        return realters;
    }
}

package co.oleh.realperfect.realter;

import co.oleh.realperfect.repository.RealterRepository;
import co.oleh.realperfect.model.Realter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RealterService {
    @Autowired
    private RealterRepository realterRepository;

    public List<Realter> findByNameOrSurnameLike(String query) {
        List<Realter> realters = realterRepository.
                findByUser_NameStartingWithOrUser_SurnameStartingWith(query, query);

        return realters;
    }

    public List<Realter> findAll() {
        List<Realter> realters = realterRepository.findAll();

        return realters;
    }
}

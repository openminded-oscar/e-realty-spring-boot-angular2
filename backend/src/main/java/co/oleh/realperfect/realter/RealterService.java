package co.oleh.realperfect.realter;

import co.oleh.realperfect.repository.RealterRepository;
import co.oleh.realperfect.model.Realter;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RealterService {
    private RealterRepository realterRepository;

    public List<Realter> findByNameOrSurnameLike(String query) {
        return realterRepository.
                findByNameStartingWith(query);
    }

    public List<Realter> findAll() {
        return realterRepository.findAll();
    }

    public Realter save(Realter realter) {
        return realterRepository.save(realter);
    }
}

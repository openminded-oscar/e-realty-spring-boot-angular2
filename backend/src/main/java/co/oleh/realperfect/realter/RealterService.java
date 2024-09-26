package co.oleh.realperfect.realter;

import co.oleh.realperfect.mapping.MappingService;
import co.oleh.realperfect.mapping.RealterDto;
import co.oleh.realperfect.repository.RealterRepository;
import co.oleh.realperfect.model.Realter;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RealterService {
    private RealterRepository realterRepository;
    private final MappingService mappingService;

    public RealterService(RealterRepository realterRepository, MappingService mappingService) {
        this.realterRepository = realterRepository;
        this.mappingService = mappingService;
    }

    public List<RealterDto> findByNameOrSurnameLike(String query) {
        List<Realter> realters = realterRepository.
                findByNameStartingWith(query);

        return realters.stream().map(r -> this.mappingService.map(r, RealterDto.class)).collect(Collectors.toList());
    }

    public List<RealterDto> findAll() {
        List<Realter> realters = realterRepository.findAll();
        return realters.stream().map(r -> this.mappingService.map(r, RealterDto.class)).collect(Collectors.toList());
    }

    public Realter save(Realter realter) {
        return realterRepository.save(realter);
    }

    public Realter findById(Long objectId) {
        return realterRepository.findById(objectId).get();
    }
}

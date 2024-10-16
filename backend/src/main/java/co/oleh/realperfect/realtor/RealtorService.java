package co.oleh.realperfect.realtor;

import co.oleh.realperfect.mapping.RealtorDto;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.repository.RealtorRepository;
import co.oleh.realperfect.model.Realtor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RealtorService {
    private RealtorRepository realtorRepository;
    private final MappingService mappingService;

    public RealtorService(RealtorRepository realtorRepository, MappingService mappingService) {
        this.realtorRepository = realtorRepository;
        this.mappingService = mappingService;
    }

    public List<RealtorDto> findByNameOrSurnameLike(String query) {
        List<Realtor> realtors = realtorRepository.
                findByUserNameStartingWith(query);

        List<RealtorDto> realtorDtos = realtors.stream()
                .map(r -> this.mappingService.map(r, RealtorDto.class))
                .collect(Collectors.toList());

        return realtorDtos;
    }

    public List<RealtorDto> findAll() {
        List<Realtor> realtors = realtorRepository.findAll();
        List<RealtorDto> realtorDtos = realtors.stream()
                .map(r -> this.mappingService.map(r, RealtorDto.class))
                .collect(Collectors.toList());

        return realtorDtos;
    }

    public Realtor save(Realtor realtor) {
        return realtorRepository.save(realtor);
    }

    public Realtor findById(Long objectId) {
        return realtorRepository.findById(objectId).get();
    }
}

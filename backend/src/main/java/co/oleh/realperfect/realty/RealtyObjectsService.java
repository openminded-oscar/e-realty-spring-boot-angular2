package co.oleh.realperfect.realty;

import co.oleh.realperfect.mapping.MappingService;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.model.BuildingType;
import co.oleh.realperfect.model.OperationType;
import co.oleh.realperfect.model.Realter;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.realter.RealterService;
import co.oleh.realperfect.realty.filtering.FilterItem;
import co.oleh.realperfect.realty.filtering.RealtyObjectSpecificationBuilder;
import co.oleh.realperfect.repository.RealtyObjectPhotoRepository;
import co.oleh.realperfect.repository.RealtyObjectRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RealtyObjectsService {
    private RealtyObjectRepository realtyObjectRepository;
    private RealtyObjectPhotoRepository realtyObjectPhotoRepository;
    private final RealterService realterService;
    private final MappingService mappingService;

    public RealtyObjectsService(RealtyObjectRepository realtyObjectRepository,
                                RealtyObjectPhotoRepository realtyObjectPhotoRepository,
                                RealterService realterService,
                                MappingService mappingService) {
        this.realtyObjectRepository = realtyObjectRepository;
        this.realtyObjectPhotoRepository = realtyObjectPhotoRepository;
        this.realterService = realterService;
        this.mappingService = mappingService;
    }

    public Page<RealtyObjectDto> getAllObjectsForFilterItems(List<FilterItem> filterItems, Pageable pageable) {
        RealtyObjectSpecificationBuilder builder = new RealtyObjectSpecificationBuilder();
        for(FilterItem filterItem: filterItems){
            builder.with(filterItem);
        }
        Specification<RealtyObject> spec = builder.build();

        Page<RealtyObject> objects = realtyObjectRepository.findAll(spec, pageable);

        return objects.map(o -> this.mappingService.map(o, RealtyObjectDto.class));
    }

    public Page<RealtyObjectDto> getAllObjects(Pageable pageable) {
        Page<RealtyObject> objects = realtyObjectRepository.findAll(pageable);

        return objects.map(o -> this.mappingService.map(o, RealtyObjectDto.class));
    }

    public RealtyObjectDetailsDto add(RealtyObjectDetailsDto realtyObjectDetailsDto) {
        Realter realter = this.realterService.findById(realtyObjectDetailsDto.getRealter().getId());

        RealtyObject realtyObject = this.mappingService.map(realtyObjectDetailsDto, RealtyObject.class);
        realtyObject.setRealter(realter);

        List<RealtyObjectPhoto> retrievedPhotos = realtyObject.getPhotos()
                .stream()
                .map(photoToMap -> {
                    RealtyObjectPhoto photo = realtyObjectPhotoRepository.findById(photoToMap.getId()).get();
                    photo.setType(photoToMap.getType());
                    return photo;
                })
                .collect(Collectors.toList());
        realtyObject.setPhotos(retrievedPhotos);

        RealtyObject createdObject = realtyObjectRepository.save(realtyObject);

        return this.mappingService.map(createdObject, RealtyObjectDetailsDto.class);
    }

    public RealtyObjectDetailsDto getObjectById(Long objectId) {
        RealtyObject realtyObject = realtyObjectRepository.findById(objectId).get();

        return this.mappingService.map(realtyObject, RealtyObjectDetailsDto.class);
    }

    public Set<BuildingType> getRealtyBuildingTypes() {
        Set<BuildingType> buildingTypes = new HashSet<>();
        Collections.addAll(buildingTypes, BuildingType.values());

        return buildingTypes;
    }

    public Set<OperationType> getRealtyOperationTypes() {
        Set<OperationType> operationTypes = new HashSet<>();
        Collections.addAll(operationTypes, OperationType.values());

        return operationTypes;
    }
}

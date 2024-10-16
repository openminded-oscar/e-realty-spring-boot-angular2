package co.oleh.realperfect.realty;

import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.model.BuildingType;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.photos.ConfirmationDocPhoto;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.realtor.RealtorService;
import co.oleh.realperfect.realty.filtering.FilterItem;
import co.oleh.realperfect.realty.filtering.RealtyObjectSpecificationBuilder;
import co.oleh.realperfect.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RealtyObjectsService {
    private final RealtyObjectCrudRepository realtyObjectCrudRepository;
    private RealtyObjectRepository realtyObjectRepository;
    private ObjectReviewRepository objectReviewRepository;
    private RealtyObjectPhotoRepository realtyObjectPhotoRepository;
    private ConfirmationDocPhotoRepository confirmationDocPhotoRepository;
    private final RealtorService realtorService;
    private final MappingService mappingService;
    private final UserRepository userRepository;

    public RealtyObjectsService(RealtyObjectRepository realtyObjectRepository,
                                UserRepository userRepository,
                                ConfirmationDocPhotoRepository confirmationDocPhotoRepository,
                                ObjectReviewRepository objectReviewRepository,
                                RealtyObjectPhotoRepository realtyObjectPhotoRepository,
                                RealtyObjectCrudRepository realtyObjectCrudRepository,
                                RealtorService realtorService,
                                MappingService mappingService) {
        this.confirmationDocPhotoRepository = confirmationDocPhotoRepository;
        this.objectReviewRepository = objectReviewRepository;
        this.realtyObjectRepository = realtyObjectRepository;
        this.realtyObjectCrudRepository = realtyObjectCrudRepository;
        this.userRepository = userRepository;
        this.realtyObjectPhotoRepository = realtyObjectPhotoRepository;
        this.realtorService = realtorService;
        this.mappingService = mappingService;
    }

    public Page<RealtyObjectDto> getAllObjectsForFilterItems(List<FilterItem> filterItems, Pageable pageable) {
        RealtyObjectSpecificationBuilder builder = new RealtyObjectSpecificationBuilder();
        for (FilterItem filterItem : filterItems) {
            builder.with(filterItem);
        }
        Specification<RealtyObject> spec = builder.build();

        Page<RealtyObject> objects = realtyObjectRepository.findAll(spec, pageable);

        return objects.map(o -> this.mappingService.map(o, RealtyObjectDto.class));
    }

    public List<RealtyObjectDetailsDto> getMyAllObjects(Long userId) {
        List<RealtyObject> objects = realtyObjectCrudRepository.findByOwnerId(userId);

        return objects.stream().map(o -> this.mappingService.map(o, RealtyObjectDetailsDto.class)).collect(Collectors.toList());
    }

    public Page<RealtyObjectDto> getAllObjects(Pageable pageable) {
        Page<RealtyObject> objects = realtyObjectRepository.findAll(pageable);

        return objects.map(o -> this.mappingService.map(o, RealtyObjectDto.class));
    }

    public RealtyObjectDetailsDto add(RealtyObjectDetailsDto realtyObjectDetailsDto) {
        RealtyObject realtyObject = this.mappingService.map(realtyObjectDetailsDto, RealtyObject.class);
        if (realtyObjectDetailsDto.getRealtor() != null) {
            Realtor realtor = this.realtorService.findById(realtyObjectDetailsDto.getRealtor().getId());
            realtyObject.setRealtor(realtor);
        }
        if (realtyObjectDetailsDto.getOwner() != null) {
            User owner = this.userRepository.findById(realtyObjectDetailsDto.getOwner().getId()).get();
            realtyObject.setOwner(owner);
        }

        List<RealtyObjectPhoto> retrievedPhotos = realtyObject.getPhotos()
                .stream()
                .map(photoToMap -> {
                    RealtyObjectPhoto photo = realtyObjectPhotoRepository.findById(photoToMap.getId()).get();
                    photo.setType(photoToMap.getType());
                    return photo;
                })
                .collect(Collectors.toList());
        realtyObject.setPhotos(retrievedPhotos);
        if (realtyObjectDetailsDto.getConfirmationDocPhoto() != null) {
            ConfirmationDocPhoto confPhoto =
                    confirmationDocPhotoRepository.findById(realtyObjectDetailsDto.getConfirmationDocPhoto().getId()).get();
            realtyObject.setConfirmationDocPhoto(confPhoto);
        }

        RealtyObject createdObject = realtyObjectRepository.save(realtyObject);

        return this.mappingService.map(createdObject, RealtyObjectDetailsDto.class);
    }

    public RealtyObjectDetailsDto getObjectById(Long objectId) {
        RealtyObject realtyObject = realtyObjectRepository
                .findById(objectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return this.mappingService.map(realtyObject, RealtyObjectDetailsDto.class);
    }

    public Set<BuildingType> getRealtyBuildingTypes() {
        return EnumSet.allOf(BuildingType.class);
    }

    public Boolean delete(Long objectId) {
        Instant oneWeekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        if (!objectReviewRepository.findByRealtyObjIdAndDateTimeAfter(objectId, oneWeekAgo).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You Can Not Remove Objects With Future Or Recent Reviews");
        }
        this.realtyObjectCrudRepository.deleteById(objectId);
        return true;
    }
}

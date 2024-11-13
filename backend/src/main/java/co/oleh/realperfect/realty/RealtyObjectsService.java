package co.oleh.realperfect.realty;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.model.AddressUtils;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.RealtyObjectStatus;
import co.oleh.realperfect.model.photos.ConfirmationDocPhoto;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.realtor.RealtorService;
import co.oleh.realperfect.realty.filtering.FilterItem;
import co.oleh.realperfect.realty.filtering.RealtyObjectSpecificationBuilder;
import co.oleh.realperfect.repository.*;
import org.locationtech.jts.geom.Point;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import static co.oleh.realperfect.model.AddressUtils.MIN_ZOOM_LEVEL_TO_SEARCH;
import static co.oleh.realperfect.model.user.RoleUtils.ROLE_PREFIX;

@Service
public class RealtyObjectsService {
    private final RealtyObjectCrudRepository realtyObjectCrudRepository;
    private final RealtyObjectFilterRepository realtyObjectFilterRepository;
    private final ObjectReviewRepository objectReviewRepository;
    private final RealtyObjectPhotoRepository realtyObjectPhotoRepository;
    private final ConfirmationDocPhotoRepository confirmationDocPhotoRepository;
    private final RealtorService realtorService;
    private final MappingService mappingService;
    private final UserRepository userRepository;

    public RealtyObjectsService(RealtyObjectFilterRepository realtyObjectFilterRepository,
                                UserRepository userRepository,
                                ConfirmationDocPhotoRepository confirmationDocPhotoRepository,
                                ObjectReviewRepository objectReviewRepository,
                                RealtyObjectPhotoRepository realtyObjectPhotoRepository,
                                RealtyObjectCrudRepository realtyObjectCrudRepository,
                                RealtorService realtorService,
                                MappingService mappingService) {
        this.confirmationDocPhotoRepository = confirmationDocPhotoRepository;
        this.objectReviewRepository = objectReviewRepository;
        this.realtyObjectFilterRepository = realtyObjectFilterRepository;
        this.realtyObjectCrudRepository = realtyObjectCrudRepository;
        this.userRepository = userRepository;
        this.realtyObjectPhotoRepository = realtyObjectPhotoRepository;
        this.realtorService = realtorService;
        this.mappingService = mappingService;
    }

    public List<RealtyObjectDto> getAllRealtyObjectsByGeolocation(Point point, int currentZoomLevel) {
        int zoomLevelToSearch = Math.max(currentZoomLevel - 3, MIN_ZOOM_LEVEL_TO_SEARCH);
        return this.getAllRealtyObjectsByGeolocationAndRadius(point, AddressUtils.zoomLevelToRadiusMeters(zoomLevelToSearch));
    }

    private List<RealtyObjectDto> getAllRealtyObjectsByGeolocationAndRadius(Point point, int radius) {
        List<RealtyObject> realtyObjects = this.realtyObjectCrudRepository.findWithinRadius(
                AddressUtils.pointToWkt(point), radius
        );

        return realtyObjects.stream().map(object ->
                this.mappingService.map(object, RealtyObjectDto.class)
        ).toList();
    }

    public Page<RealtyObjectDto> getAllActiveObjectsForFilterItems(List<FilterItem> filterItems, Pageable pageable) {
        RealtyObjectSpecificationBuilder builder = new RealtyObjectSpecificationBuilder();
        filterItems.add(FilterItem.ofStatusActive());

        for (FilterItem filterItem : filterItems) {
            builder.with(filterItem);
        }
        Specification<RealtyObject> spec = builder.build();

        Page<RealtyObject> objects = realtyObjectFilterRepository.findAll(spec, pageable);

        return objects.map(o -> this.mappingService.map(o, RealtyObjectDto.class));
    }

    public List<RealtyObjectDetailsDto> getMyAllObjects(Long userId) {
        List<RealtyObject> objects = realtyObjectCrudRepository.findByOwnerId(userId);

        return objects.stream().map(o -> this.mappingService.map(o, RealtyObjectDetailsDto.class)).collect(Collectors.toList());
    }

    public Page<RealtyObjectDto> getAllObjects(Pageable pageable) {
        Page<RealtyObject> objects = realtyObjectFilterRepository.findAll(pageable);

        return objects.map(o -> this.mappingService.map(o, RealtyObjectDto.class));
    }

    public RealtyObjectDetailsDto save(RealtyObjectDetailsDto realtyObjectDetailsDto) {
        RealtyObject realtyObject = this.mappingService.map(realtyObjectDetailsDto, RealtyObject.class);
        if (realtyObject.getAddress().getGeolocation() == null) {
            realtyObject.getAddress().setGeolocation(AddressUtils.lonLatToPoint(1, 1));
        }

        if (realtyObjectDetailsDto.getId() != null) {
            RealtyObject existingObjectInDb =
                    this.realtyObjectCrudRepository.findById(realtyObjectDetailsDto.getId()).get();
            realtyObject.setStatus(existingObjectInDb.getStatus());
        }
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

        RealtyObject createdObject = realtyObjectCrudRepository.save(realtyObject);

        return this.mappingService.map(createdObject, RealtyObjectDetailsDto.class);
    }

    public RealtyObjectDetailsDto getObjectById(Long objectId) {
        RealtyObject realtyObject = realtyObjectCrudRepository
                .findById(objectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        return this.mappingService.map(realtyObject, RealtyObjectDetailsDto.class);
    }

    public void verifyRealtorOrAdminOrOwner(SpringSecurityUser user, Long objectId) {
        Long userId = user.getId();
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        if (!authorities.contains(new SimpleGrantedAuthority(ROLE_PREFIX + "ADMIN")) &&
                !authorities.contains(new SimpleGrantedAuthority(ROLE_PREFIX + "REALTOR"))) {
            RealtyObject realtyObject = this.realtyObjectCrudRepository.findById(objectId).get();
            if (!realtyObject.getOwner().getId().equals(userId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
        }
    }

    public int setRealtyObjectStatusById(Long objectId, RealtyObjectStatus realtyObjectStatus) {
        return this.realtyObjectCrudRepository.updateRealtyObjectStatusById(objectId, realtyObjectStatus);
    }

    public Boolean delete(Long objectId) {
        Instant oneWeekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        if (!objectReviewRepository.findByRealtyObjIdAndDateTimeAfter(objectId, oneWeekAgo).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You Can Not Remove Objects With Future Or Recent" +
                    " Reviews");
        }
        this.realtyObjectCrudRepository.deleteById(objectId);
        return true;
    }
}

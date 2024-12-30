package co.oleh.realperfect.realty;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.emails.EmailsService;
import co.oleh.realperfect.interest.InterestService;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectAdminDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDtoLikable;
import co.oleh.realperfect.model.GeoLocationUtils;
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
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static co.oleh.realperfect.model.user.RoleUtils.isAdminOrRealtor;

@Service
@Slf4j
public class RealtyObjectsService {
    private final RealtyObjectCrudRepository realtyObjectCrudRepository;
    private final RealtyObjectFilterRepository realtyObjectFilterRepository;
    private final ObjectReviewRepository objectReviewRepository;
    private final RealtyObjectPhotoRepository realtyObjectPhotoRepository;
    private final ConfirmationDocPhotoRepository confirmationDocPhotoRepository;
    private final EmailsService emailsService;
    private final RealtorService realtorService;
    private final MappingService mappingService;
    private final UserRepository userRepository;
    private final InterestService interestService;

    public RealtyObjectsService(RealtyObjectFilterRepository realtyObjectFilterRepository,
                                UserRepository userRepository,
                                InterestService interestService,
                                EmailsService emailsService,
                                ConfirmationDocPhotoRepository confirmationDocPhotoRepository,
                                ObjectReviewRepository objectReviewRepository,
                                RealtyObjectPhotoRepository realtyObjectPhotoRepository,
                                RealtyObjectCrudRepository realtyObjectCrudRepository,
                                RealtorService realtorService,
                                MappingService mappingService) {
        this.realtyObjectFilterRepository = realtyObjectFilterRepository;
        this.userRepository = userRepository;
        this.interestService = interestService;
        this.emailsService = emailsService;
        this.confirmationDocPhotoRepository = confirmationDocPhotoRepository;
        this.objectReviewRepository = objectReviewRepository;
        this.realtyObjectPhotoRepository = realtyObjectPhotoRepository;
        this.realtyObjectCrudRepository = realtyObjectCrudRepository;
        this.realtorService = realtorService;
        this.mappingService = mappingService;
    }

    public Page<RealtyObjectAdminDto> getAllItemsForAdmin(Pageable pageable,
                                                          Long regionId,
                                                          String supportedOperation) {
        RealtyObjectSpecificationBuilder builder = new RealtyObjectSpecificationBuilder();
        List<FilterItem> filterItems = new ArrayList<>();
        if (regionId != null) {
            filterItems.add(FilterItem.ofRegionId(regionId));
        }
        if (supportedOperation != null) {
            filterItems.add(FilterItem.ofSupportedOperation(supportedOperation));
        }
        filterItems.forEach(builder::with);

        Specification<RealtyObject> spec = builder.build();
        return realtyObjectFilterRepository.findAll(spec, pageable)
                .map(o -> mappingService.map(o, RealtyObjectAdminDto.class));
    }

    public Page<RealtyObjectDtoLikable> getAllActiveObjectsForFilterItems(List<FilterItem> filterItems,
                                                                          Pageable pageable) {
        if (filterItems == null) {
            filterItems = new ArrayList<>();
        }
        filterItems.add(FilterItem.ofStatusActive());
        RealtyObjectSpecificationBuilder builder = new RealtyObjectSpecificationBuilder();
        filterItems.forEach(builder::with);
        Specification<RealtyObject> spec = builder.build();
        Page<RealtyObject> objects = realtyObjectFilterRepository.findAll(spec, pageable);

        List<Long> objectIds = objects.stream().map(RealtyObject::getId).collect(Collectors.toList());
        Map<Long, Long> likesPerId = interestService.countByRealtyObjIds(objectIds);

        return objects.map(o -> {
            RealtyObjectDtoLikable dto = mappingService.map(o, RealtyObjectDtoLikable.class);
            dto.setLikesAmount(likesPerId.getOrDefault(dto.getId(), 0L));
            return dto;
        });
    }

    public List<RealtyObjectDetailsDto> getMyAllObjects(Long userId) {
        return realtyObjectCrudRepository.findByOwnerId(userId).stream()
                .map(o -> mappingService.map(o, RealtyObjectDetailsDto.class))
                .collect(Collectors.toList());
    }

    public Page<RealtyObjectDto> getAllObjects(Pageable pageable) {
        return realtyObjectFilterRepository.findAll(pageable)
                .map(o -> mappingService.map(o, RealtyObjectDto.class));
    }

    public RealtyObjectDetailsDto insert(@Valid RealtyObjectDetailsDto realtyObjectDto, SpringSecurityUser springUser) {
        RealtyObject realtyObjectSaved = save(realtyObjectDto, Optional.empty());
        Optional.ofNullable(realtyObjectDto.getRealtor()).ifPresent(realtorDto -> {
            Realtor realtor = realtorService.findById(realtorDto.getId());
            User user = userRepository.findById(springUser.getId()).orElseThrow();
            if (realtor != null) {
                emailsService.sendNewObjectSetForRealtorAsync(user, realtyObjectSaved, realtor);
            }
        });
        return mappingService.map(realtyObjectSaved, RealtyObjectDetailsDto.class);
    }

    public RealtyObjectDetailsDto update(@Valid RealtyObjectDetailsDto realtyObject, Long objectId) {
        realtyObject.setId(objectId);
        RealtyObject existingObjectInDb = realtyObjectCrudRepository.findById(objectId).orElseThrow();
        RealtyObject realtyObjectSaved = save(realtyObject, Optional.of(existingObjectInDb));
        return mappingService.map(realtyObjectSaved, RealtyObjectDetailsDto.class);
    }

    private RealtyObject save(RealtyObjectDetailsDto realtyObjectDetailsDto,
                              Optional<RealtyObject> existingRealtyObject) {
        RealtyObject realtyObject = mappingService.map(realtyObjectDetailsDto, RealtyObject.class);
        if (realtyObject.getAddress().getGeolocation() == null) {
            realtyObject.getAddress().setGeolocation(GeoLocationUtils.lonLatToPoint(1, 1));
        }
        existingRealtyObject.ifPresent(existingObject -> realtyObject.setStatus(existingObject.getStatus()));
        Optional.ofNullable(realtyObjectDetailsDto.getRealtor()).ifPresent(realtorDto -> {
            Realtor realtor = realtorService.findById(realtorDto.getId());
            realtyObject.setRealtor(realtor);
        });
        Optional.ofNullable(realtyObjectDetailsDto.getOwner()).ifPresent(ownerDto -> {
            User owner = userRepository.findById(ownerDto.getId()).orElse(null);
            realtyObject.setOwner(owner);
        });

        List<RealtyObjectPhoto> retrievedPhotos = realtyObject.getPhotos()
                .stream()
                .map(photoToMap -> realtyObjectPhotoRepository.findById(photoToMap.getId())
                        .map(photo -> {
                            photo.setType(photoToMap.getType());
                            return photo;
                        })
                        .orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        realtyObject.setPhotos(retrievedPhotos);


        Optional.ofNullable(realtyObjectDetailsDto.getConfirmationDocPhoto()).ifPresent(confPhotoDto -> {
            ConfirmationDocPhoto confPhoto =
                    confirmationDocPhotoRepository.findById(confPhotoDto.getId()).orElse(null);
            realtyObject.setConfirmationDocPhoto(confPhoto);
        });

        return realtyObjectCrudRepository.save(realtyObject);
    }

    public RealtyObjectDetailsDto getObjectById(Long objectId) {
        RealtyObject realtyObject = realtyObjectCrudRepository.findById(objectId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return mappingService.map(realtyObject, RealtyObjectDetailsDto.class);
    }

    public void verifyRealtorOrAdminOrOwner(SpringSecurityUser user, Long objectId) {
        Long userId = user.getId();

        if (!isAdminOrRealtor(user)) {
            RealtyObject realtyObject = realtyObjectCrudRepository.findById(objectId).orElseThrow();
            if (!realtyObject.getOwner().getId().equals(userId)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }
        }
    }

    public int setRealtyObjectStatusById(Long objectId, RealtyObjectStatus realtyObjectStatus) {
        return realtyObjectCrudRepository.updateRealtyObjectStatusById(objectId, realtyObjectStatus);
    }

    @Transactional
    public Boolean delete(Long objectId) {
        Instant oneWeekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        if (!objectReviewRepository.findByRealtyObjIdAndDateTimeAfter(objectId, oneWeekAgo).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot remove objects with future or recent " +
                    "reviews.");
        }
        try {
            realtyObjectCrudRepository.deleteById(objectId);
        } catch (DataIntegrityViolationException e) {
            log.error("Error while removing realty object {}: {}", objectId, e.getMessage());
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }
        return true;
    }
}

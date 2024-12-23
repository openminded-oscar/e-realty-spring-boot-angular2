package co.oleh.realperfect.realty;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.emails.EmailsService;
import co.oleh.realperfect.interest.InterestService;
import co.oleh.realperfect.mapping.mappers.MappingService;
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
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import static co.oleh.realperfect.model.user.RoleUtils.ROLE_PREFIX;

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
                                MappingService mappingService, InterestService interestService1) {
        this.emailsService = emailsService;
        this.confirmationDocPhotoRepository = confirmationDocPhotoRepository;
        this.objectReviewRepository = objectReviewRepository;
        this.realtyObjectFilterRepository = realtyObjectFilterRepository;
        this.realtyObjectCrudRepository = realtyObjectCrudRepository;
        this.userRepository = userRepository;
        this.realtyObjectPhotoRepository = realtyObjectPhotoRepository;
        this.realtorService = realtorService;
        this.mappingService = mappingService;
        this.interestService = interestService;
    }

    public Page<RealtyObjectDtoLikable> getAllActiveObjectsForFilterItems(List<FilterItem> filterItems, Pageable pageable) {
        if (filterItems == null) {
            filterItems = new ArrayList<>();
        }
        RealtyObjectSpecificationBuilder builder = new RealtyObjectSpecificationBuilder();
        filterItems.add(FilterItem.ofStatusActive());

        for (FilterItem filterItem : filterItems) {
            builder.with(filterItem);
        }
        Specification<RealtyObject> spec = builder.build();
        Page<RealtyObject> objects = realtyObjectFilterRepository.findAll(spec, pageable);

        Page<RealtyObjectDtoLikable> page = objects.map(o -> this.mappingService.map(o, RealtyObjectDtoLikable.class));

        Map<Long, Long> likesPerId = this.interestService.countByRealtyObjIds(objects.stream().map(RealtyObject::getId)
                .collect(Collectors.toList()));
        page.forEach(p -> p.setLikesAmount(Optional.ofNullable(likesPerId.get(p.getId())).orElse(0L)));
        return page;
    }

    public List<RealtyObjectDetailsDto> getMyAllObjects(Long userId) {
        List<RealtyObject> objects = realtyObjectCrudRepository.findByOwnerId(userId);

        return objects.stream().map(o -> this.mappingService.map(o, RealtyObjectDetailsDto.class)).collect(Collectors.toList());
    }

    public Page<RealtyObjectDto> getAllObjects(Pageable pageable) {
        Page<RealtyObject> objects = realtyObjectFilterRepository.findAll(pageable);

        return objects.map(o -> this.mappingService.map(o, RealtyObjectDto.class));
    }

    public RealtyObjectDetailsDto insert(@Valid RealtyObjectDetailsDto realtyObjectDto,
                                         SpringSecurityUser springUser) {
        RealtyObject realtyObjectSaved = this.save(realtyObjectDto, Optional.empty());

        if (realtyObjectDto.getRealtor() != null) {
            Realtor realtor = this.realtorService.findById(realtyObjectDto.getRealtor().getId());
            User user = this.userRepository.findById(springUser.getId()).get();
            if (realtor != null) {
                this.emailsService.sendNewObjectSetForRealtorAsync(user, realtyObjectSaved, realtor);
            }
        }

        return this.mappingService.map(realtyObjectSaved, RealtyObjectDetailsDto.class);
    }

    public RealtyObjectDetailsDto update(@Valid RealtyObjectDetailsDto realtyObject, Long objectId) {
        realtyObject.setId(objectId);

        RealtyObject existingObjectInDb = this.realtyObjectCrudRepository.findById(realtyObject.getId()).get();
        RealtyObject realtyObjectSaved = this.save(realtyObject, Optional.of(existingObjectInDb));

        return this.mappingService.map(realtyObjectSaved, RealtyObjectDetailsDto.class);
    }

    private RealtyObject save(RealtyObjectDetailsDto realtyObjectDetailsDto,
                              Optional<RealtyObject> existingRealtyObject) {
        RealtyObject realtyObject = this.mappingService.map(realtyObjectDetailsDto, RealtyObject.class);
        if (realtyObject.getAddress().getGeolocation() == null) {
            realtyObject.getAddress().setGeolocation(GeoLocationUtils.lonLatToPoint(1, 1));
        }

        if (existingRealtyObject.isPresent()) {
            RealtyObject existingObjectInDb = existingRealtyObject.get();
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

        return realtyObjectCrudRepository.save(realtyObject);
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

    @Transactional
    public Boolean delete(Long objectId) {
        Instant oneWeekAgo = Instant.now().minus(7, ChronoUnit.DAYS);
        if (!objectReviewRepository.findByRealtyObjIdAndDateTimeAfter(objectId, oneWeekAgo).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You Can Not Remove Objects With Future Or Recent" +
                    " Reviews");
        }
        try {
            this.realtyObjectCrudRepository.deleteById(objectId);
        } catch (DataIntegrityViolationException e) {
            log.error("Error while removing realty object" + objectId + e.getMessage());
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
        }

        return true;
    }
}

package co.oleh.realperfect.realty;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.emails.EmailsService;
import co.oleh.realperfect.interest.InterestService;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectAdminDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDtoLikable;
import co.oleh.realperfect.model.ObjectReview;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.RealtyObjectStatus;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.realtor.RealtorService;
import co.oleh.realperfect.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

public class RealtyObjectsServiceTest {
    @Mock
    private RealtyObjectCrudRepository realtyObjectCrudRepository;
    @Mock
    private RealtyObjectFilterRepository realtyObjectFilterRepository;
    @Mock
    private ObjectReviewRepository objectReviewRepository;
    @Mock
    private RealtyObjectPhotoRepository realtyObjectPhotoRepository;
    @Mock
    private ConfirmationDocPhotoRepository confirmationDocPhotoRepository;
    @Mock
    private EmailsService emailsService;
    @Mock
    private RealtorService realtorService;
    @Mock
    private MappingService mappingService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private InterestService interestService;

    private RealtyObjectsService realtyObjectsService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        realtyObjectsService = new RealtyObjectsService(
                realtyObjectFilterRepository,
                userRepository,
                interestService,
                emailsService,
                confirmationDocPhotoRepository,
                objectReviewRepository,
                realtyObjectPhotoRepository,
                realtyObjectCrudRepository,
                realtorService,
                mappingService
        );
    }

    @Test
    public void testGetAllItemsForAdmin() {
        Page<RealtyObject> mockPage = new PageImpl<>(List.of(new RealtyObject()));
        when(realtyObjectFilterRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(mockPage);
        when(mappingService.map(any(RealtyObject.class), eq(RealtyObjectAdminDto.class)))
                .thenReturn(new RealtyObjectAdminDto());

        Page<RealtyObjectAdminDto> result = realtyObjectsService.getAllItemsForAdmin(PageRequest.of(0, 10), null, null);

        assertEquals(1, result.getTotalElements());
    }

    @Test
    public void testGetAllActiveObjectsForFilterItems() {
        Page<RealtyObject> mockPage = new PageImpl<>(List.of(new RealtyObject()));
        when(realtyObjectFilterRepository.findAll(any(Specification.class), any(Pageable.class)))
                .thenReturn(mockPage);
        when(mappingService.map(any(RealtyObject.class), eq(RealtyObjectDtoLikable.class)))
                .thenReturn(new RealtyObjectDtoLikable());
        when(interestService.countByRealtyObjIds(anyList())).thenReturn(Map.of(1L, 10L));

        Page<RealtyObjectDtoLikable> result = realtyObjectsService.getAllActiveObjectsForFilterItems(null,
                PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
    }

    @Test
    public void testGetMyAllObjects() {
        when(realtyObjectCrudRepository.findByOwnerId(anyLong())).thenReturn(List.of(new RealtyObject()));
        when(mappingService.map(any(RealtyObject.class), eq(RealtyObjectDetailsDto.class)))
                .thenReturn(new RealtyObjectDetailsDto());

        List<RealtyObjectDetailsDto> result = realtyObjectsService.getMyAllObjects(1L);

        assertEquals(1, result.size());
    }

    @Test
    public void testInsert() {
        RealtyObjectDetailsDto dto = new RealtyObjectDetailsDto();
        RealtyObject realtyObject = new RealtyObject();
        when(mappingService.map(any(RealtyObjectDetailsDto.class), eq(RealtyObject.class)))
                .thenReturn(realtyObject);
        when(realtyObjectCrudRepository.save(any(RealtyObject.class))).thenReturn(realtyObject);
        when(mappingService.map(any(RealtyObject.class), eq(RealtyObjectDetailsDto.class)))
                .thenReturn(dto);

        RealtyObjectDetailsDto result = realtyObjectsService.insert(dto, new SpringSecurityUser(1L, "user", "email" +
                "@email.com", Collections.EMPTY_LIST));

        assertNotNull(result);
    }

    @Test
    public void testUpdate() {
        RealtyObjectDetailsDto dto = new RealtyObjectDetailsDto();
        RealtyObject realtyObject = new RealtyObject();
        when(realtyObjectCrudRepository.findById(anyLong())).thenReturn(Optional.of(realtyObject));
        when(mappingService.map(any(RealtyObjectDetailsDto.class), eq(RealtyObject.class)))
                .thenReturn(realtyObject);
        when(realtyObjectCrudRepository.save(any(RealtyObject.class))).thenReturn(realtyObject);
        when(mappingService.map(any(RealtyObject.class), eq(RealtyObjectDetailsDto.class)))
                .thenReturn(dto);

        RealtyObjectDetailsDto result = realtyObjectsService.update(dto, 1L);

        assertNotNull(result);
    }

    @Test
    public void testGetObjectById() {
        RealtyObject realtyObject = new RealtyObject();
        when(realtyObjectCrudRepository.findById(anyLong())).thenReturn(Optional.of(realtyObject));
        when(mappingService.map(any(RealtyObject.class), eq(RealtyObjectDetailsDto.class)))
                .thenReturn(new RealtyObjectDetailsDto());

        RealtyObjectDetailsDto result = realtyObjectsService.getObjectById(1L);

        assertNotNull(result);
    }

    @Test
    public void testGetObjectById_NotFound() {
        when(realtyObjectCrudRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> realtyObjectsService.getObjectById(1L));
    }

    @Test
    public void testVerifyRealtorOrAdminOrOwner() {
        SpringSecurityUser user = new SpringSecurityUser(1L, "user", "password", Collections.EMPTY_LIST);
        RealtyObject realtyObject = new RealtyObject();
        User owner = new User();
        owner.setId(1L);
        realtyObject.setOwner(owner);
        when(realtyObjectCrudRepository.findById(anyLong())).thenReturn(Optional.of(realtyObject));

        assertDoesNotThrow(() -> realtyObjectsService.verifyRealtorOrAdminOrOwner(user, 1L));
    }

    @Test
    public void testVerifyRealtorOrAdminOrOwner_Forbidden() {
        SpringSecurityUser user = new SpringSecurityUser(2L, "user", "password", Collections.EMPTY_LIST);

        RealtyObject realtyObject = new RealtyObject();
        User owner = new User();
        owner.setId(1L);
        realtyObject.setOwner(owner);
        when(realtyObjectCrudRepository.findById(anyLong())).thenReturn(Optional.of(realtyObject));

        assertThrows(ResponseStatusException.class, () -> realtyObjectsService.verifyRealtorOrAdminOrOwner(user, 1L));
    }

    @Test
    public void testSetRealtyObjectStatusById() {
        when(realtyObjectCrudRepository.updateRealtyObjectStatusById(anyLong(), any(RealtyObjectStatus.class)))
                .thenReturn(1);

        int result = realtyObjectsService.setRealtyObjectStatusById(1L, RealtyObjectStatus.ACTIVE);

        assertEquals(1, result);
    }

    @Test
    public void testDelete() {
        when(objectReviewRepository.findByRealtyObjIdAndDateTimeAfter(anyLong(), any()))
                .thenReturn(List.of());
        doNothing().when(realtyObjectCrudRepository).deleteById(anyLong());

        Boolean result = realtyObjectsService.delete(1L);

        assertTrue(result);
    }

    @Test
    public void testDelete_Forbidden() {
        when(objectReviewRepository.findByRealtyObjIdAndDateTimeAfter(anyLong(), any()))
                .thenReturn(List.of(new ObjectReview()));

        assertThrows(ResponseStatusException.class, () -> realtyObjectsService.delete(1L));
    }
}

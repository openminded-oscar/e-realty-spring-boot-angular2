package co.oleh.realperfect.realty;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.mapping.UserDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.model.BuildingType;
import co.oleh.realperfect.realtor.RealtorService;
import co.oleh.realperfect.realty.filtering.FilterItem;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(value = "/api/realty-objects")
@AllArgsConstructor()
public class RealtyObjectsApi {
    private static final Logger LOGGER = LoggerFactory.getLogger(RealtyObjectsApi.class);

    private RealtyObjectsService realtyObjectsService;
    private RealtorService realtorService;


    @GetMapping(value = "/{objectId}")
    public ResponseEntity<RealtyObjectDetailsDto> getObjectDetails(@PathVariable Long objectId) {
        RealtyObjectDetailsDto realtyObject = realtyObjectsService.getObjectById(objectId);

        return new ResponseEntity<>(realtyObject, HttpStatus.OK);
    }

    @GetMapping(value = "/my")
    public ResponseEntity<List<RealtyObjectDetailsDto>> getRealtyObjects(@AuthenticationPrincipal SpringSecurityUser user) {
        List<RealtyObjectDetailsDto> myObjects = realtyObjectsService.getMyAllObjects(user.getId());
        return new ResponseEntity<>(myObjects, HttpStatus.OK);
    }

    @GetMapping(value = "/my-as-realtor")
    @RolesAllowed({"REALTOR", "ADMIN"})
    public ResponseEntity<List<RealtyObjectDetailsDto>> getRealtorRealtyObjects(
            @AuthenticationPrincipal SpringSecurityUser user
    ) {
        List<RealtyObjectDetailsDto> myObjects = realtorService.getRealtorObjectsByUserId(user.getId());
        return new ResponseEntity<>(myObjects, HttpStatus.OK);
    }

    @PostMapping()
    @Cacheable(value = "realtyObjectGalleryCache", keyGenerator = "realtyObjectFilterKeyGenerator")
    public ResponseEntity<Page<RealtyObjectDto>> getRealtyObjects(@RequestBody(required = false)
                                                                  List<FilterItem> filterItems,
                                                                  Pageable pageable) {
        Page<RealtyObjectDto> allObjects;
        if (filterItems != null) {
            allObjects = realtyObjectsService.getAllObjectsForFilterItems(filterItems, pageable);
        } else {
            allObjects = realtyObjectsService.getAllObjects(pageable);
        }

        return new ResponseEntity<>(allObjects, HttpStatus.OK);
    }

    @PostMapping("/save")
    public ResponseEntity<RealtyObjectDetailsDto> postRealtyObject(@AuthenticationPrincipal SpringSecurityUser user,
                                                                   @Valid @RequestBody RealtyObjectDetailsDto realtyObject) {
        realtyObject.setOwner(new UserDto() {{
            setId(user.getId());
        }});
        RealtyObjectDetailsDto addedObject = realtyObjectsService.add(realtyObject);

        return new ResponseEntity<>(addedObject, HttpStatus.OK);
    }

    @DeleteMapping("/{objectId}")
    public ResponseEntity<Boolean> deleteRealtyObject(@PathVariable Long objectId) {
        return new ResponseEntity<>(realtyObjectsService.delete(objectId), HttpStatus.OK);
    }

    @GetMapping("/building-types")
    public ResponseEntity<Set<BuildingType>> getRealtyBuildingTypes() {
        Set<BuildingType> buildingTypes = realtyObjectsService.getRealtyBuildingTypes();

        return new ResponseEntity<>(buildingTypes, HttpStatus.OK);
    }
}
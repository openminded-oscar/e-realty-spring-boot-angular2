package co.oleh.realperfect.realty;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.model.BuildingType;
import co.oleh.realperfect.model.OperationType;
import co.oleh.realperfect.realty.filtering.FilterItem;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor()
public class RealtyObjectsApi {
    private static final Logger LOGGER = LoggerFactory.getLogger(RealtyObjectsApi.class);

    private RealtyObjectsService realtyObjectsService;


    @GetMapping(value = "/realty-objects/{objectId}")
    public ResponseEntity<RealtyObjectDetailsDto> getObjectDetails(@PathVariable Long objectId) {
        RealtyObjectDetailsDto realtyObject = realtyObjectsService.getObjectById(objectId);

        return new ResponseEntity<>(realtyObject, HttpStatus.OK);
    }

    @GetMapping(value = "/realty-objects/my")
    public ResponseEntity<List<RealtyObjectDetailsDto>> getRealtyObjects(@AuthenticationPrincipal SpringSecurityUser user) {
        List<RealtyObjectDetailsDto> myObjects = realtyObjectsService.getMyAllObjects(user.getId());
        return new ResponseEntity<>(myObjects, HttpStatus.OK);
    }

    @PostMapping(value = "/realty-objects")
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

    @PostMapping("/realty-objects/save")
    public ResponseEntity<RealtyObjectDetailsDto> postRealtyObject(@Valid @RequestBody RealtyObjectDetailsDto realtyObject) {
        RealtyObjectDetailsDto addedObject = realtyObjectsService.add(realtyObject);

        return new ResponseEntity<>(addedObject, HttpStatus.OK);
    }

    @DeleteMapping("/realty-objects/{objectId}")
    public ResponseEntity<Boolean> deleteRealtyObject(@PathVariable Long objectId) {
        return new ResponseEntity<>(realtyObjectsService.delete(objectId), HttpStatus.OK);
    }

    @GetMapping("/realty-objects/building-types")
    public ResponseEntity<Set<BuildingType>> getRealtyBuildingTypes() {
        Set<BuildingType> buildingTypes = realtyObjectsService.getRealtyBuildingTypes();

        return new ResponseEntity<>(buildingTypes, HttpStatus.OK);
    }

    @GetMapping("/realty-objects/supported-operations")
    public ResponseEntity<Set<OperationType>> getRealtySupportedOperations() {
        Set<OperationType> operationTypes = realtyObjectsService.getRealtyOperationTypes();

        return new ResponseEntity<>(operationTypes, HttpStatus.OK);
    }
}
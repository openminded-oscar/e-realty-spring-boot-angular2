package co.oleh.realperfect.realty;

import co.oleh.realperfect.model.BuildingType;
import co.oleh.realperfect.model.OperationType;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.realty.filtering.FilterItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping(value = "/api")
@CrossOrigin(origins = "http://localhost:4200")
public class RealtyObjectsApi {
    private static final Logger LOGGER = LoggerFactory.getLogger(RealtyObjectsApi.class);

    @Autowired
    private RealtyObjectsService realtyObjectsService;


    @GetMapping(value = "/realty-objects/{objectId}")
    public ResponseEntity<RealtyObject> getObjectDetails(@PathVariable Long objectId) {
        RealtyObject realtyObject = realtyObjectsService.getObjectById(objectId);

        return new ResponseEntity<>(realtyObject, HttpStatus.OK);
    }

    @PostMapping(value = "/realty-objects")
    public ResponseEntity<Page<RealtyObject>> getRealtyObjects(@RequestBody(required = false) List<FilterItem> filterItems,
                                                               Pageable pageable) {
        Page<RealtyObject> allObjects;
        if (filterItems != null) {
            allObjects = realtyObjectsService.getAllObjectsForFilterItems(filterItems, pageable);
        } else {
            allObjects = realtyObjectsService.getAllObjects(pageable);
        }

        return new ResponseEntity<>(allObjects, HttpStatus.OK);
    }

    @PostMapping("/realty-object/save")
    public ResponseEntity<RealtyObject> postRealtyObject(@RequestBody RealtyObject realtyObject) {
        RealtyObject addedObject = realtyObjectsService.add(realtyObject);
        return new ResponseEntity<>(addedObject, HttpStatus.OK);
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
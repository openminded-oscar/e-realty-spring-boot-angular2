package co.oleh.realperfect.realty;

import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.model.AddressUtils;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.repository.RealtyObjectCrudRepository;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import java.util.List;

import static co.oleh.realperfect.model.AddressUtils.MIN_ZOOM_LEVEL_TO_SEARCH;

@Service
public class RealtyObjectsByGeolocationService {
    private final RealtyObjectCrudRepository realtyObjectCrudRepository;
    private final MappingService mappingService;

    public RealtyObjectsByGeolocationService(RealtyObjectCrudRepository realtyObjectCrudRepository,
                                             MappingService mappingService) {
        this.realtyObjectCrudRepository = realtyObjectCrudRepository;
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
}

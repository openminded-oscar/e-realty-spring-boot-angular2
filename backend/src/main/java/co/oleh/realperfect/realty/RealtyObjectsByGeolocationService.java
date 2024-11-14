package co.oleh.realperfect.realty;

import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.model.GeoLocationUtils;
import co.oleh.realperfect.model.GeoSegment;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.repository.RealtyObjectCrudRepository;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

import static co.oleh.realperfect.model.GeoLocationUtils.ZOOM_LEVEL_FOR_AUTOGENERATE;
import static co.oleh.realperfect.model.GeoLocationUtils.zoomLevelToRadiusMeters;

@Service
@Slf4j
public class RealtyObjectsByGeolocationService {
    private final RealtyObjectCrudRepository realtyObjectCrudRepository;
    private final MappingService mappingService;

    public List<GeoSegment> geoSegments;
    public Map<GeoSegment, List<RealtyObjectDto>> objectsBySectorsCache;

    public RealtyObjectsByGeolocationService(RealtyObjectCrudRepository realtyObjectCrudRepository,
                                             MappingService mappingService) {
        this.realtyObjectCrudRepository = realtyObjectCrudRepository;
        this.mappingService = mappingService;

        this.geoSegments = GeoLocationUtils.generateRegionalCentersForUkraine();
    }

    public List<RealtyObjectDto> getAllRealtyObjectsByLngLatAndZoomLevel(double longitude,
                                                                         double latitude,
                                                                         int zoomLevel) {
        return geoSegments.stream()
                .min(Comparator.comparingDouble(segment ->
                        GeoLocationUtils.calculateDistanceSquared(latitude, longitude, segment)))
                .flatMap(nearestSegment ->
                        Optional.ofNullable(objectsBySectorsCache.get(nearestSegment)))
                .orElse(this.getAllRealtyObjectsByLngLat(longitude, latitude));
    }

    @Transactional
    public void resetObjectsByGeoSegments() {
        this.objectsBySectorsCache = new HashMap<>();
        for (GeoSegment geoSegment : geoSegments) {
            List<RealtyObjectDto> sectorObjects =
                    this.getAllRealtyObjectsByLngLat(
                            geoSegment.getCenterLongitude(),
                            geoSegment.getCenterLatitude()
                    );
            objectsBySectorsCache.put(geoSegment, sectorObjects);
        }
    }

    private List<RealtyObjectDto> getAllRealtyObjectsByLngLat(double lng,
                                                              double lat) {
        int radius = zoomLevelToRadiusMeters(ZOOM_LEVEL_FOR_AUTOGENERATE);
        Point point = GeoLocationUtils.lonLatToPoint(lng, lat);

        List<RealtyObject> realtyObjects = this.realtyObjectCrudRepository.findWithinRadius(
                GeoLocationUtils.pointToWkt(point), radius
        );

        return realtyObjects.stream().map(object ->
                this.mappingService.map(object, RealtyObjectDto.class)
        ).toList();
    }
}

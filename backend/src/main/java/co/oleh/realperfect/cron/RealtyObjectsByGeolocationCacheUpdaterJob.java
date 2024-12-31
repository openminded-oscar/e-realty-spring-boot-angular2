package co.oleh.realperfect.cron;

import co.oleh.realperfect.realty.RealtyObjectsByGeolocationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

@Service
@Slf4j
public class RealtyObjectsByGeolocationCacheUpdaterJob {
    private final RealtyObjectsByGeolocationService realtyObjectsByGeolocationService;

    public RealtyObjectsByGeolocationCacheUpdaterJob(RealtyObjectsByGeolocationService realtyObjectsByGeolocationService) {
        this.realtyObjectsByGeolocationService = realtyObjectsByGeolocationService;
    }

    @PostConstruct
    public void initializeCache() {
        log.info("Initializing geolocation data...");
        realtyObjectsByGeolocationService.resetObjectsByGeoSegments();
        log.info("Geolocation data initialization completed.");
    }

    @Scheduled(cron = "0 */5 * * * *")
    public void updateRealtyObjectsByGeolocation() {
        log.info("Starting geolocation data reset...");
        realtyObjectsByGeolocationService.resetObjectsByGeoSegments();
        log.info("Geolocation data reset completed.");
    }
}

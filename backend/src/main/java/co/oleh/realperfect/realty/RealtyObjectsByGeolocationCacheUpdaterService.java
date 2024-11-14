package co.oleh.realperfect.realty;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class RealtyObjectsByGeolocationCacheUpdaterService {
    private final RealtyObjectsByGeolocationService realtyObjectsByGeolocationService;

    @Scheduled(cron = "0 */5 * * * *")
    public void updateRealtyObjectsByGeolocation() {
        log.info("Starting geolocation data reset...");
//        realtyObjectsByGeolocationService.resetObjectsByGeoSegments();
        log.info("Geolocation data reset completed.");
    }
}
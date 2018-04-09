package co.oleh.realperfect.config;

import com.google.maps.GeoApiContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GoogleConfig {
    @Bean
    GeoApiContext geoApiContext() {
        return new GeoApiContext.Builder().apiKey("""").build();
    }
}

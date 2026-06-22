package co.oleh.realperfect.realty.perf;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

/**
 * Supplies the beans the {@code @DataJpaTest} slice does not autoconfigure but that the bootstrapped
 * {@code UiApplication} config class needs — namely an {@link ObjectMapper} for its constructor.
 * Keeps the slice minimal (no web/socket/mail) while still letting the context start.
 */
@TestConfiguration(proxyBeanMethods = false)
public class PerfTestConfig {

    @Bean
    ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}

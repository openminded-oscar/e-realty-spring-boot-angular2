package co.oleh.realperfect.mapping;

import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.converter.builtin.PassThroughConverter;
import ma.glasnost.orika.impl.ConfigurableMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MappingConfig extends ConfigurableMapper {
    protected void configure(MapperFactory factory) {
        factory.getConverterFactory().registerConverter(new PassThroughConverter(LocalDateTime.class));
    }
}
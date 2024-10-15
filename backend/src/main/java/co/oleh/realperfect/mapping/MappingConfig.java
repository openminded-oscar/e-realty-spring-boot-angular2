package co.oleh.realperfect.mapping;

import co.oleh.realperfect.model.Realtor;
import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.converter.builtin.PassThroughConverter;
import ma.glasnost.orika.impl.ConfigurableMapper;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class MappingConfig extends ConfigurableMapper {
    public static RealtorDto map(Realtor realtor) {
        RealtorDto dto = new RealtorDto();

        return dto;
    }

    protected void configure(MapperFactory factory) {
        factory.getConverterFactory().registerConverter(new PassThroughConverter(Instant.class));
    }
}
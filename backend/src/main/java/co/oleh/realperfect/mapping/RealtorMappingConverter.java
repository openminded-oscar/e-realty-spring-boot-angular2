package co.oleh.realperfect.mapping;


import co.oleh.realperfect.model.Realtor;
import ma.glasnost.orika.CustomConverter;
import ma.glasnost.orika.metadata.Type;
import org.springframework.stereotype.Component;

@Component
public class RealtorMappingConverter extends CustomConverter<Realtor, RealtorDto> {

    @Override
    public RealtorDto convert(Realtor source, Type<? extends RealtorDto> destinationType) {
        RealtorDto dto = new RealtorDto();
        dto.setId(source.getId());
        if (source.getUser() != null) {
            dto.setName(source.getUser().getName());
            dto.setSurname(source.getUser().getSurname());
        }
        return dto;
    }
}
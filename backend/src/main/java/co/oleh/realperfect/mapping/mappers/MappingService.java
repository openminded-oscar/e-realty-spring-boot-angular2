package co.oleh.realperfect.mapping.mappers;

import co.oleh.realperfect.mapping.RealtorDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class MappingService {
    private final ModelMapper modelMapper;

    public MappingService(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public <T, V> V map(T from, Class<V> to) {
        if (from == null) {
            return null;
        }
        V result = modelMapper.map(from, to);

        // Custom mapping for RealtorDto
        if (result instanceof RealtorDto realtorDto && from instanceof Realtor realtor) {
            // Create a new instance of RealtorDto with updated values
            realtorDto = new RealtorDto(
                    realtorDto.id(), // Assuming id is part of the original realtorDto
                    realtor.getUser().getName(),
                    realtor.getUser().getEmail(),
                    realtor.getUser().getSurname(),
                    realtor.getUser().getPhoneNumber(),
                    realtor.getUser().getProfilePic()
            );
            return (V) realtorDto; // Return the new instance
        }

        // Custom mapping for RealtyObjectDetailsDto
        if (result instanceof RealtyObjectDetailsDto dto && from instanceof RealtyObject object) {
            dto.setRealtor(this.map(object.getRealtor(), RealtorDto.class));
        }

        // Custom mapping for RealtyObjectDto
        if (result instanceof RealtyObjectDto dto && from instanceof RealtyObject object) {
            dto.setRealtor(this.map(object.getRealtor(), RealtorDto.class));
        }

        return result;
    }

    public <T, V> List<V> mapList(List<T> from, Class<V> to) {
        List<V> convertingResult = new ArrayList<>();
        for (T item : from) {
            convertingResult.add(map(item, to));
        }
        return convertingResult;
    }
}

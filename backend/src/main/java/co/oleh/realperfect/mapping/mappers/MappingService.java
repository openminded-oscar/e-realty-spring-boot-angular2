package co.oleh.realperfect.mapping.mappers;

import co.oleh.realperfect.mapping.RealtorDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
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

    public <T, V> V map(T fromObj, Class<V> destClass) {
        if (fromObj == null) {
            return null;
        }
        V result = modelMapper.map(fromObj, destClass);

        if (result instanceof RealtorDto to && fromObj instanceof Realtor from) {
            to.setName(from.getUser().getName());
            to.setSurname(from.getUser().getSurname());
            to.setEmail(from.getUser().getEmail());
            to.setPhoneNumber(from.getUser().getPhoneNumber());
            to.setProfilePic(from.getUser().getProfilePic());
        }

        if (result instanceof RealtyObjectDto to && fromObj instanceof RealtyObject from) {
            to.setRealtor(this.map(from.getRealtor(), RealtorDto.class));
        }

        if (result instanceof RealtyObjectDetailsDto to && fromObj instanceof RealtyObject from) {
            to.setRealtor(this.map(from.getRealtor(), RealtorDto.class));
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

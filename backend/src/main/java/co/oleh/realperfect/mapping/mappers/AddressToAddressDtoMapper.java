package co.oleh.realperfect.mapping.mappers;

import co.oleh.realperfect.mapping.AddressDto;
import co.oleh.realperfect.model.Address;
import lombok.NonNull;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.modelmapper.AbstractConverter;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class AddressToAddressDtoMapper extends AbstractConverter<Address, AddressDto> {
    @Override
    public AddressDto convert(@NonNull final Address from) {
        ModelMapper modelMapper = new ModelMapper();
        AddressDto to = new AddressDto();
        modelMapper.map(from, to);
        if (from.getGeolocation() != null) {
            to.setLat(from.getGeolocation().getX());
            to.setLng(from.getGeolocation().getY());
        }
        return to;
    }
}

package co.oleh.realperfect.mapping.mappers;

import co.oleh.realperfect.mapping.AddressDto;
import co.oleh.realperfect.model.Address;
import co.oleh.realperfect.model.AddressUtils;
import lombok.NonNull;
import org.locationtech.jts.geom.Point;
import org.modelmapper.AbstractConverter;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class AddressDtoToAddressMapper extends AbstractConverter<AddressDto, Address> {
    @Override
    public Address convert(@NonNull final AddressDto from) {
        Address to = new Address();
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.map(from, to);

        if (from.getLat() != null && from.getLng() != null) {
            Point p = AddressUtils.createPointFromCoordinates(from.getLng(), from.getLat());
            to.setGeolocation(p);
        }
        return to;
    }
}

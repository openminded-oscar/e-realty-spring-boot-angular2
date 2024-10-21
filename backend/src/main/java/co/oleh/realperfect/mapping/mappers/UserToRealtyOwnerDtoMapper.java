package co.oleh.realperfect.mapping.mappers;

import co.oleh.realperfect.mapping.UserDto;
import co.oleh.realperfect.model.user.Role;
import co.oleh.realperfect.model.user.User;
import lombok.NonNull;
import org.modelmapper.AbstractConverter;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserToRealtyOwnerDtoMapper extends AbstractConverter<User, UserDto> {
    private final ModelMapper modelMapper;
    public UserToRealtyOwnerDtoMapper() {
        this.modelMapper = new ModelMapper();
        this.modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
    }

    @Override
    public UserDto convert(@NonNull final User source) {
        UserDto dto = new UserDto();
        this.modelMapper.map(source, dto);
        dto.setRoles(source.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
        return dto;
    }
}

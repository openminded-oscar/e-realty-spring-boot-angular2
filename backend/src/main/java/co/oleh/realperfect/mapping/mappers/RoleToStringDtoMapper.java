package co.oleh.realperfect.mapping.mappers;

import co.oleh.realperfect.model.user.Role;
import org.modelmapper.AbstractConverter;
import org.springframework.stereotype.Component;

@Component
public class RoleToStringDtoMapper extends AbstractConverter<Role, String> {
    @Override
    protected String convert(Role role) {
        return role.getName();
    }
}

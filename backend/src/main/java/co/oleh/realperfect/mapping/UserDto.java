package co.oleh.realperfect.mapping;

import co.oleh.realperfect.model.Realter;
import co.oleh.realperfect.model.user.Role;
import lombok.Data;

import java.util.Set;

@Data
public class UserDto {
     Long id;
     String login;
     Set<RoleDto> roles;
     String name;
     String surname;
     String phoneNumber;
     String email;
     String profilePic;
     RealterDto realterDetails;
}

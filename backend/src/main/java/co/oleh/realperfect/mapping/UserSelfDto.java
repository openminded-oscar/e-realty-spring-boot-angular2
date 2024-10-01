package co.oleh.realperfect.mapping;

import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import lombok.Data;

import java.util.Set;

@Data
public class UserSelfDto {
     Long id;
     String login;
     Set<RoleDto> roles;
     String name;
     String surname;
     String phoneNumber;
     String email;
     String profilePic;
     RealterDto realterDetails;
     Set<RealtyObjectDto> realtyObjects;
}

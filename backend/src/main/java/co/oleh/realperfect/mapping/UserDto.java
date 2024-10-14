package co.oleh.realperfect.mapping;

import lombok.Data;

import java.util.Set;

@Data
public class UserDto {
     Long id;
     Set<String> roles;
     String name;
     String surname;
     String phoneNumber;
     String email;
     String profilePic;
}

package co.oleh.realperfect.mapping;

import lombok.Data;

import java.util.Set;

@Data
public class UserProfileDto {
     String name;
     String surname;
     String phoneNumber;
     String email;
     String profilePic;
}

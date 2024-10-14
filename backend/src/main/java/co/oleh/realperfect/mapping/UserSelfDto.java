package co.oleh.realperfect.mapping;

import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.model.photos.UserPhoto;
import lombok.Data;

import java.time.Instant;
import java.util.Set;

@Data
public class UserSelfDto {
     Long id;
     String login;
     Set<String> roles;
     String name;
     String surname;
     String phoneNumber;
     String email;
//     TODO change to picture dto???
     UserPhoto profilePic;
     RealtorDto realtorDetails;
     Set<RealtyObjectDto> realtyObjects;
     Instant createdAt;
     Instant updatedAt;
}

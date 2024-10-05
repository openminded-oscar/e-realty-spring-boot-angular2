package co.oleh.realperfect.mapping;

import co.oleh.realperfect.model.photos.UserPhoto;
import lombok.Data;

@Data
public class UserProfileDto {
     String name;
     String surname;
     String phoneNumber;
     String email;
     UserPhoto profilePic;
}

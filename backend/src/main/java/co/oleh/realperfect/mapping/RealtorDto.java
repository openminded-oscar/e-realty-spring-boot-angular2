package co.oleh.realperfect.mapping;

import co.oleh.realperfect.model.photos.UserPhoto;
import lombok.Data;

@Data
public class RealtorDto {
    private Long id;

    private String name;
    private String email;
    private String surname;
    private String phoneNumber;

    private UserPhoto profilePic;
}

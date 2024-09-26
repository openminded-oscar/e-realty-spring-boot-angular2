package co.oleh.realperfect.mapping;

import co.oleh.realperfect.model.photos.UserPhoto;
import lombok.Data;

@Data
public class RealterDto {
    private Long id;

    private String name;
    private String surname;

    private UserPhoto photo;
}

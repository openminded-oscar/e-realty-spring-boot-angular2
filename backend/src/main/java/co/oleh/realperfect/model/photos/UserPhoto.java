package co.oleh.realperfect.model.photos;

import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@NoArgsConstructor
@Table(name = "tbl_user_photo")
public class UserPhoto extends Photo {
    public UserPhoto(String filename) {
        super(filename);
    }
}

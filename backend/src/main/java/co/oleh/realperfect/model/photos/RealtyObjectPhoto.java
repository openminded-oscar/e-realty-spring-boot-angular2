package co.oleh.realperfect.model.photos;

import co.oleh.realperfect.model.RealtyPhotoType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@Entity
@Table(name = "tbl_realty_object_photo")
@NoArgsConstructor
@ToString
public class RealtyObjectPhoto extends Photo {
    private RealtyPhotoType type;

    public RealtyObjectPhoto(String filename) {
        super(filename);
    }

    @Column(name = "photo_type")
    @Enumerated(EnumType.STRING)
    public RealtyPhotoType getType() {
        return type;
    }

    public void setType(RealtyPhotoType type) {
        this.type = type;
    }
}

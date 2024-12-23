package co.oleh.realperfect.mapping;

import co.oleh.realperfect.model.RealtyPhotoType;
import lombok.Data;

@Data
public class PhotoDto {
    private RealtyPhotoType type;
    private Long id;
    private String filename;
}

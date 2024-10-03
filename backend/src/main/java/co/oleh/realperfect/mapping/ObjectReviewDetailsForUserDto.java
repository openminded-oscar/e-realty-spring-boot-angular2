package co.oleh.realperfect.mapping;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import lombok.Data;

import java.time.Instant;

@Data
public class ObjectReviewDetailsForUserDto {
    Long id;
    Long userId;
    RealtyObjectDetailsDto realtyObj;
    Instant dateTime;
}

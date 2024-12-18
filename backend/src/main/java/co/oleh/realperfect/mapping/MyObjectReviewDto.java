package co.oleh.realperfect.mapping;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import lombok.Data;

import java.time.Instant;

@Data
public class MyObjectReviewDto {
    Long id;
    UserProfileDto user;
    Long realtorId;
    RealtyObjectDetailsDto realtyObj;
    Instant dateTime;
    Boolean approved;
}

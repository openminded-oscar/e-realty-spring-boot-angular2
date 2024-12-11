package co.oleh.realperfect.mapping;
import lombok.Data;

import java.time.Instant;

@Data
public class ObjectReviewDto {
    Long id;
    Long userId;
    Long realtorId;
    Long realtyObjId;
    Instant dateTime;
    Boolean approved;
}

package co.oleh.realperfect.mapping;
import lombok.Data;

import java.time.Instant;

@Data
public class ObjectReviewDto {
    Long id;
    Long userId;
    Long realtyObjId;
    Instant dateTime;
}

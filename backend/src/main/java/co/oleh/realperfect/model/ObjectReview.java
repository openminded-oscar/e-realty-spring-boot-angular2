package co.oleh.realperfect.model;


import lombok.Data;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "tbl_object_review")
public class ObjectReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long realtyObjId;

    private LocalDateTime dateTime;

    @Type(type= "org.hibernate.type.LocalDateTimeType")
    public LocalDateTime getDateTime() {
        return dateTime;
    }
}

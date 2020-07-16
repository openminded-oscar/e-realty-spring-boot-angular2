package co.oleh.realperfect.model;


import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "tbl_object_review")
public class ObjectReview {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long userId;

    private Long realtyObjId;

    private LocalDateTime dateTime;
}

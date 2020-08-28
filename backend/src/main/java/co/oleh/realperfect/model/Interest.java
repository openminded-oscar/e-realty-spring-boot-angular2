package co.oleh.realperfect.model;


import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "tbl_interest")
public class Interest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Long realtyObjId;
}

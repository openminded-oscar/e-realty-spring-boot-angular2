package co.oleh.realperfect.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "tbl_picture_info")
@NoArgsConstructor
public class PictureInfo {
    private Long id;

    @Getter
    @Setter
    private String filename;

    public PictureInfo(String filename) {
        this.filename = filename;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}

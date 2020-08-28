package co.oleh.realperfect.model.photos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

@MappedSuperclass
@NoArgsConstructor
@ToString
public class Photo {
    private Long id;

    @Getter
    @Setter
    private String filename;

    public Photo(String filename) {
        this.filename = filename;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}

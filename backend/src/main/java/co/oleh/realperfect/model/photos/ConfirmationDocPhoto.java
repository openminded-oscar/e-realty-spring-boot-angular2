package co.oleh.realperfect.model.photos;

import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "tbl_confirmation_doc_photo")
@NoArgsConstructor
@ToString
public class ConfirmationDocPhoto extends Photo {
    public ConfirmationDocPhoto(String filename) {
        super(filename);
    }
}

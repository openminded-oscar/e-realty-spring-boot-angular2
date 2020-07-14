package co.oleh.realperfect.model;

import co.oleh.realperfect.model.photos.UserPhoto;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
@Table(name = "tbl_realter")
public class Realter {
	private Long id;

	private String name;
	private String surname;


	private UserPhoto photo;

	@OneToOne(cascade = CascadeType.MERGE, orphanRemoval = true)
	@JoinColumn(name = "photo_id")
	public UserPhoto getPhoto() {
		return photo;
	}

	public void setPhoto(UserPhoto userPhoto) {
		this.photo = userPhoto;
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
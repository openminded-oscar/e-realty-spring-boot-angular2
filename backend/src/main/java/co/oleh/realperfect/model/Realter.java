package co.oleh.realperfect.model;

import co.oleh.realperfect.model.photos.UserPhoto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Table(name = "tbl_realter")
public class Realter {
	private Long id;

	private String name;
	private String surname;
	
	private UserPhoto photo;

	private List<RealtyObject> realtyObjects;

	@OneToMany(cascade = CascadeType.MERGE, orphanRemoval = true)
	@JoinColumn(name = "realter_id")
	@JsonIgnoreProperties("realter")
	public List<RealtyObject> getRealtyObjects() {
		return realtyObjects;
	}

	public void setRealtyObjects(List<RealtyObject> realtyObjects) {
		this.realtyObjects = realtyObjects;
	}

	@OneToOne(cascade = CascadeType.MERGE, orphanRemoval = true)
	@JoinColumn(name = "photo_id")
	public UserPhoto getPhoto() {
		return photo;
	}

	public void setPhoto(UserPhoto userPhoto) {
		this.photo = userPhoto;
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
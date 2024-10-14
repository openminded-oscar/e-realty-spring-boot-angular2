package co.oleh.realperfect.model;

import co.oleh.realperfect.model.photos.UserPhoto;
import co.oleh.realperfect.model.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Table(name = "tbl_realtor")
public class Realtor {
	private Long id;

	private String name;
	private String surname;
	private User user;
	private UserPhoto profilePic;
	private List<RealtyObject> realtyObjects;

	@OneToOne()
	@JoinColumn(name = "user_id")
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@OneToMany(cascade = CascadeType.MERGE, orphanRemoval = true)
	@JoinColumn(name = "realtor_id")
	@JsonIgnoreProperties("realtor")
	public List<RealtyObject> getRealtyObjects() {
		return realtyObjects;
	}

	public void setRealtyObjects(List<RealtyObject> realtyObjects) {
		this.realtyObjects = realtyObjects;
	}

	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "photo_id")
	public UserPhoto getProfilePic() {
		return profilePic;
	}

	public void setProfilePic(UserPhoto userPhoto) {
		this.profilePic = userPhoto;
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
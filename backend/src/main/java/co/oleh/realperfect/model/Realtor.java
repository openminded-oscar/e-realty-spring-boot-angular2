package co.oleh.realperfect.model;

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
	private User user;
	private List<RealtyObject> realtyObjects;

	@OneToMany(cascade = CascadeType.MERGE)
	@JoinColumn(name = "realtor_id")
	@JsonIgnoreProperties("realtor")
	public List<RealtyObject> getRealtyObjects() {
		return realtyObjects;
	}

	public void setRealtyObjects(List<RealtyObject> realtyObjects) {
		this.realtyObjects = realtyObjects;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@OneToOne()
	@JoinColumn(name = "user_id")
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
}
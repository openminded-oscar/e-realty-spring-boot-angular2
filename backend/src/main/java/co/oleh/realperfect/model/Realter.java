package co.oleh.realperfect.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Data
@Table(name = "tbl_realter")
public class Realter {
	private Long id;

	private String name;
	private String surname;
	private String photoFilename;

//	private Set<RealtyObject> realtyObjects;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}


//	@OneToMany(fetch = FetchType.LAZY, mappedBy = "realter")
//	public Set<RealtyObject> getRealtyObjects() {
//		return realtyObjects;
//	}
//
//	public void setRealtyObjects(Set<RealtyObject> realtyObjects) {
//		this.realtyObjects = realtyObjects;
//	}
}
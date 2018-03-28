package co.oleh.realperfect.model;

import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tbl_city")
public class City {
	private Long id;
	private String name;
	private Region region;
	private String district;
	private Set<StreetInCity> cityStreet;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Enumerated(EnumType.STRING)
	public Region getRegion() {
		return region;
	}

	public void setRegion(Region region) {
		this.region = region;
	}

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "city")
	@JsonIgnore
	public Set<StreetInCity> getCityStreet() {
		return cityStreet;
	}

	public void setCityStreet(Set<StreetInCity> cityStreet) {
		this.cityStreet = cityStreet;
	}
}
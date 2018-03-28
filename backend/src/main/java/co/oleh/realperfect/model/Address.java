package co.oleh.realperfect.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Embeddable
public class Address {
	private StreetInCity streetInCity;
	// +
	private Integer numberOfStreet;
	// -
	private String numberOfStreetSuffix;
	// +
	private Integer aptNumber;


	@ManyToOne
	@JoinColumn(name="street_in_city_id")
	public StreetInCity getStreetInCity() {
		return streetInCity;
	}

	public void setStreetInCity(StreetInCity streetInCity) {
		this.streetInCity = streetInCity;
	}
	
	@Column(name="number_of_street")
	public Integer getNumberOfStreet() {
		return numberOfStreet;
	}

	public void setNumberOfStreet(Integer numberOfStreet) {
		this.numberOfStreet = numberOfStreet;
	}
	
	@Column(name="apt_number")
	public Integer getAptNumber() {
		return aptNumber;
	}

	public void setAptNumber(Integer aptNumber) {
		this.aptNumber = aptNumber;
	}

	@Column(name="number_of_street_suffix")
	public String getNumberOfStreetSuffix() {
		return numberOfStreetSuffix;
	}

	public void setNumberOfStreetSuffix(String numberOfStreetSuffix) {
		this.numberOfStreetSuffix = numberOfStreetSuffix;
	}
}

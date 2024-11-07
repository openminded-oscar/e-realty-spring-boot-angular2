package co.oleh.realperfect.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.math.BigDecimal;

@Embeddable
public class Address {
	private String city;
	private String street;
	private String numberOfStreet;
	private Integer apartmentNumber;
	private BigDecimal lat;
	private BigDecimal lng;

	@Column(name="city")
	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	@Column(name="street")
	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	@Column(name="apt_number")
	public Integer getApartmentNumber() {
		return apartmentNumber;
	}

	public void setApartmentNumber(Integer apartmentNumber) {
		this.apartmentNumber = apartmentNumber;
	}

	@Column(name="number_of_street")
	public String getNumberOfStreet() {
		return numberOfStreet;
	}

	public void setNumberOfStreet(String numberOfStreet) {
		this.numberOfStreet = numberOfStreet;
	}

	@Column(name="lat")
	public BigDecimal getLat() {
		return lat;
	}

	public void setLat(BigDecimal lat) {
		this.lat = lat;
	}

	@Column(name="lng")
	public BigDecimal getLng() {
		return lng;
	}

	public void setLng(BigDecimal lng) {
		this.lng = lng;
	}
}

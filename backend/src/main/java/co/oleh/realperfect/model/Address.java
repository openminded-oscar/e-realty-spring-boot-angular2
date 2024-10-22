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
	private BigDecimal latitude;
	private BigDecimal longitude;

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

	@Column(name="latitude")
	public BigDecimal getLatitude() {
		return latitude;
	}

	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}

	@Column(name="longitude")
	public BigDecimal getLongitude() {
		return longitude;
	}

	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}
}

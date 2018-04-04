package co.oleh.realperfect.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Embeddable
public class Address {
	private String numberOfStreet;
	private Integer aptNumber;

	@Column(name="number_of_street")
	public String getNumberOfStreet() {
		return numberOfStreet;
	}

	public void setNumberOfStreet(String numberOfStreet) {
		this.numberOfStreet = numberOfStreet;
	}
	
	@Column(name="apt_number")
	public Integer getAptNumber() {
		return aptNumber;
	}

	public void setAptNumber(Integer aptNumber) {
		this.aptNumber = aptNumber;
	}
}

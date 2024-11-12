package co.oleh.realperfect.mapping;

import lombok.Data;

@Data
public class AddressDto {
    private String city;
    private String street;
    private String numberOfStreet;
    private Integer apartmentNumber;
    private Double lng;
    private Double lat;
}

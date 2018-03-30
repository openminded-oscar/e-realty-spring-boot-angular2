package co.oleh.realperfect.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CityOnMap {
    private String name;
    private Double lat;
    private Double lng;

    public CityOnMap(String name, Double lat, Double lng) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
    }
}

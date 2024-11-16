package co.oleh.realperfect.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Location {
    private String name;
    private Double lat;
    private Double lng;

    public Location(String name, Double lng, Double lat) {
        this.name = name;
        this.lat = lat;
        this.lng = lng;
    }
}

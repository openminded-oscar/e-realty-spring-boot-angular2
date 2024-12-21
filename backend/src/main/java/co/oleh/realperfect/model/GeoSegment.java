package co.oleh.realperfect.model;


import lombok.Data;

import java.util.Objects;

@Data
public class GeoSegment {
    private Long id;
    private String name;
    private final double centerLatitude;
    private final double centerLongitude;

    public GeoSegment(Long id, String name, double longitude, double latitude) {
        this(name, longitude, latitude);
        this.id = id;
    }

    public GeoSegment(String name, double longitude, double latitude) {
        this(longitude, latitude);
        this.name = name;
    }

    public GeoSegment(double longitude, double latitude) {
        this.centerLatitude = latitude;
        this.centerLongitude = longitude;
    }

    @Override
    public String toString() {
        return "Segment{" +
                "name=" + (name != null ? name : "") +
                "latitude=" + centerLatitude +
                ", longitude=" + centerLongitude +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GeoSegment that)) return false;
        return Double.compare(centerLatitude, that.centerLatitude) == 0 && Double.compare(centerLongitude,
                that.centerLongitude) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(centerLatitude, centerLongitude);
    }
}

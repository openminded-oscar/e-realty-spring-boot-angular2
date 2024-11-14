package co.oleh.realperfect.model;

import lombok.Data;
import java.util.Objects;

@Data
public class GeoSegment {
    private final double centerLatitude;
    private final double centerLongitude;

    public GeoSegment(double latitude, double longitude) {
        this.centerLatitude = latitude;
        this.centerLongitude = longitude;
    }

    @Override
    public String toString() {
        return "Segment{" +
                "latitude=" + centerLatitude +
                ", longitude=" + centerLongitude +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof GeoSegment that)) return false;
        return Double.compare(centerLatitude, that.centerLatitude) == 0 && Double.compare(centerLongitude, that.centerLongitude) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(centerLatitude, centerLongitude);
    }
}
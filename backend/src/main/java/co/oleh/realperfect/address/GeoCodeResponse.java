package co.oleh.realperfect.address;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class GeoCodeResponse {
    @JsonProperty("results")
    private List<Result> results;
    private String status;

    @Data
    public static class AddressComponent {
        @JsonProperty("long_name")
        private String longName;
        @JsonProperty("short_name")
        private String shortName;
        private List<String> types;
    }

    @Data
    public static class Location {
        private double lat;
        private double lng;
    }

    @Data
    public static class Viewport {
        private Location northeast;
        private Location southwest;
    }

    @Data
    public static class Geometry {
        private Location location;
        private String locationType;
        private Viewport viewport;
    }

    @Data
    public static class Result {
        @JsonProperty("address_components")
        private List<AddressComponent> addressComponents;
        @JsonProperty("formatted_address")
        private String formattedAddress;
        private Geometry geometry;
        @JsonProperty("place_id")
        private String placeId;
        private List<String> types;
    }
}
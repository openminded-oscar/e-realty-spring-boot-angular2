package co.oleh.realperfect.mapping;

import lombok.Data;

@Data
public class RegionDto {
    private Long id;
    private String name;
    private Double lat;
    private Double lng;
}

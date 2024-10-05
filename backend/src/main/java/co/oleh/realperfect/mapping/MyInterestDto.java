package co.oleh.realperfect.mapping;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import lombok.Data;

@Data
public class MyInterestDto {
    Long id;
    Long userId;
    RealtyObjectDetailsDto realtyObj;
}

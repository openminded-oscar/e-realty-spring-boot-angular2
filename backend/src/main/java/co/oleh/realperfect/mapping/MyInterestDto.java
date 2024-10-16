package co.oleh.realperfect.mapping;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;

public record MyInterestDto(Long id, Long userId, RealtyObjectDetailsDto realtyObj){}

package co.oleh.realperfect.mapping;

import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;

import java.time.Instant;

public record MyObjectReviewDto(Long id, Long userId, RealtyObjectDetailsDto realtyObj, Instant dateTime) {}

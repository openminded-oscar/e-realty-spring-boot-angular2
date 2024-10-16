package co.oleh.realperfect.mapping;

import java.time.Instant;

public record ObjectReviewDto(Long id, Long userId, Long realtyObjId, Instant dateTime) {}

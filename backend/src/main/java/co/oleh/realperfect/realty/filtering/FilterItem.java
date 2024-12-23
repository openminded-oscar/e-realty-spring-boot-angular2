package co.oleh.realperfect.realty.filtering;

import lombok.*;


@Getter
@Setter
@ToString
@Builder
public class FilterItem {
	private String field;
	private String value;
	private FilterOperation operation;


    public static FilterItem ofStatusActive() {
        return FilterItem.builder()
                .field("status")
                .operation(FilterOperation.EQ)
                .value("ACTIVE")
                .build();
    }
}
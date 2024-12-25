package co.oleh.realperfect.realty.filtering;

import lombok.*;


@Getter
@Setter
@ToString
@Builder
public class FilterItem {
    public static String REGION_FILTER_PATH = "address.region.id";

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
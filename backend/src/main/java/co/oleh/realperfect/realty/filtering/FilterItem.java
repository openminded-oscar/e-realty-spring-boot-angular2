package co.oleh.realperfect.realty.filtering;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class FilterItem {
	private String field;
	private String value;
	private FilterOperation operation;


    public static FilterItem ofStatusActive() {
        FilterItem statusActiveFilter = new FilterItem();

        statusActiveFilter.setField("status");
        statusActiveFilter.setOperation(FilterOperation.EQ);
        statusActiveFilter.setValue("ACTIVE");

        return statusActiveFilter;
    }
}
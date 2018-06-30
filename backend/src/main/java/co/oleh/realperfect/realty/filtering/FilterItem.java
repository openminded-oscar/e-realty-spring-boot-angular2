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
	private String operation;
}
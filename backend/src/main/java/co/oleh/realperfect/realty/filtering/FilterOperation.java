package co.oleh.realperfect.realty.filtering;

import lombok.Getter;

@Getter
public enum FilterOperation {
    EQ("eq"), GE("ge"), LE("le"), LIKE("like"), CONTAINS("operationtypecontains");

    private final String operation;
    FilterOperation(String operation) {
        this.operation = operation;
    }

    public static FilterOperation fromString(String operation) {
        for (FilterOperation op : values()) {
            if (op.getOperation().equalsIgnoreCase(operation)) {
                return op;
            }
        }
        throw new IllegalArgumentException("Unknown operation: " + operation);
    }
}

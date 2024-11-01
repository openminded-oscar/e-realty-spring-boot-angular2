package co.oleh.realperfect.realty.filtering;

import co.oleh.realperfect.model.OperationType;
import co.oleh.realperfect.model.RealtyObject;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.util.Collection;

public class RealtyObjectSpecification implements Specification<RealtyObject> {
    private final FilterItem filterItem;

    public RealtyObjectSpecification(FilterItem filterItem) {
        this.filterItem = filterItem;
    }

    @Override
    public Predicate toPredicate(Root<RealtyObject> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        Path<String> keyPath = getField(root, filterItem.getField());
        String operation = filterItem.getOperation();
        String value = filterItem.getValue();

        FilterOperation filterOperation = FilterOperation.fromString(operation);
        switch (filterOperation) {
            case GE:
                return cb.greaterThanOrEqualTo(keyPath, value);
            case LE:
                return cb.lessThanOrEqualTo(keyPath, value);
            case EQ:
            case LIKE: {
                Class<?> keyPathClass = keyPath.getJavaType();
                if (keyPathClass == String.class) {
                    return cb.like(cb.lower(keyPath), "%" + value.toLowerCase() + "%");
                } else {
                    if (keyPathClass.isEnum()) {
                        Object enumObject = toEnum(keyPathClass, value);
                        return cb.equal(keyPath, enumObject);
                    }
                    return cb.equal(keyPath, value);
                }
            }
            case CONTAINS: {
                Expression<Collection<OperationType>> operationTypes = root.get(filterItem.getField());
                OperationType operationType = (OperationType) toEnum(OperationType.class, value);
                return cb.isMember(operationType, operationTypes);
            }
        }

        return null;
    }

    private Object toEnum(Class<?> keyPathClass, String value) {
        try {
            return keyPathClass.getMethod("valueOf", String.class).invoke(null, value);
        } catch (Exception e) {
            throw new RuntimeException("Exception on casting value " +
                    value + " to enum type " + keyPathClass.toString() + "");
        }
    }

    private Path<String> getField(Root<RealtyObject> root, String key) {
        String[] keyParts = key.split("\\.");
        Path<String> path = null;
        for (int i = 0; i < keyParts.length; ++i) {
            if (i == 0) {
                path = root.get(keyParts[i]);
            } else {
                path = path.get(keyParts[i]);
            }
        }

        return path;
    }
}
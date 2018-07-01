package co.oleh.realperfect.realty.filtering;

import co.oleh.realperfect.model.RealtyObject;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;
import java.lang.reflect.InvocationTargetException;

public class RealtyObjectSpecification implements Specification<RealtyObject> {
    private final SearchCriteria criteria;

    public RealtyObjectSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<RealtyObject> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        String operation = criteria.getOperation();
        Path<String> keyPath = getField(root, criteria.getKey());
        Class<?> keyPathClass = keyPath.getJavaType();
        String value = criteria.getValue().toString();

        switch (operation.toLowerCase()) {
            case "ge":
                return cb.greaterThanOrEqualTo(keyPath, value);
            case "le":
                return cb.lessThanOrEqualTo(keyPath, value);
            case "eq":
            case "like": {
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
        Path path = null;
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
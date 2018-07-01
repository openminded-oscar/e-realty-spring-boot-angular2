package co.oleh.realperfect.realty.filtering;

import co.oleh.realperfect.model.RealtyObject;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.*;

public class RealtyObjectSpecification implements Specification<RealtyObject> {
    private final SearchCriteria criteria;

    public RealtyObjectSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<RealtyObject> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        String operation = criteria.getOperation();
        Path<String> keyPath = getFieldFromRoot(root, criteria.getKey());

        if (operation.equalsIgnoreCase("ge")) {
            return cb.greaterThanOrEqualTo(
                    keyPath, criteria.getValue().toString());
        } else if (operation.equalsIgnoreCase("le")) {
            return cb.lessThanOrEqualTo(
                    keyPath, criteria.getValue().toString());
        } else if (operation.equalsIgnoreCase("eq") || operation.equalsIgnoreCase("like")) {
            if (keyPath.getJavaType() == String.class) {
                return cb.like(
                        cb.lower(keyPath), "%" + criteria.getValue().toString().toLowerCase() + "%");
            } else {
                return cb.equal(keyPath, criteria.getValue());
            }
        }
        return null;
    }

    private Path<String> getFieldFromRoot(Root<RealtyObject> root, String key) {
        String[] keyParts = key.split("\\.");
        Path path = null;
        for (int i = 0; i < keyParts.length; ++i) {
            if (i == 0) {
                path = root.get(keyParts[i]);
            }
            else{
                path = path.get(keyParts[i]);
            }
        }

        return path;
    }
}
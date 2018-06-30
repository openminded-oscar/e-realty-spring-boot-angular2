package co.oleh.realperfect.realty.filtering;

import co.oleh.realperfect.model.RealtyObject;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import java.util.ArrayList;
import java.util.List;

public class RealtyObjectSpecificationBuilder {
    private final List<SearchCriteria> params;

    public RealtyObjectSpecificationBuilder() {
        params = new ArrayList<SearchCriteria>();
    }

    public RealtyObjectSpecificationBuilder with(String key, String operation, Object value) {
        params.add(new SearchCriteria(key, operation, value));
        return this;
    }

    public Specification<RealtyObject> build() {
        if (params.size() == 0) {
            return null;
        }

        List<Specification<RealtyObject>> specs = new ArrayList<Specification<RealtyObject>>();
        for (SearchCriteria param : params) {
            specs.add(new RealtyObjectSpecification(param));
        }

        Specification<RealtyObject> result = specs.get(0);
        for (int i = 1; i < specs.size(); i++) {
            result = Specifications.where(result).and(specs.get(i));
        }
        return result;
    }
}
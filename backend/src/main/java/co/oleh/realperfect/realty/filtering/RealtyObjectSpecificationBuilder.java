package co.oleh.realperfect.realty.filtering;

import co.oleh.realperfect.model.RealtyObject;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.domain.Specifications;

import java.util.ArrayList;
import java.util.List;

public class RealtyObjectSpecificationBuilder {
    private final List<FilterItem> params;

    public RealtyObjectSpecificationBuilder() {
        params = new ArrayList<FilterItem>();
    }

    public RealtyObjectSpecificationBuilder with(FilterItem filterItem) {
        params.add(filterItem);
        return this;
    }

    public Specification<RealtyObject> build() {
        if (params.size() == 0) {
            return null;
        }

        List<Specification<RealtyObject>> specs = new ArrayList<Specification<RealtyObject>>();
        for (FilterItem param : params) {
            specs.add(new RealtyObjectSpecification(param));
        }

        Specification<RealtyObject> result = specs.get(0);
        for (int i = 1; i < specs.size(); i++) {
            result = Specifications.where(result).and(specs.get(i));
        }
        return result;
    }
}
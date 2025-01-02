package co.oleh.realperfect.realty.filtering;

import co.oleh.realperfect.model.RealtyObject;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

// TODO make bean scope request to unit test better (to be able to mock in service test)
public class RealtyObjectSpecificationBuilder {
    private List<FilterItem> params;

    public RealtyObjectSpecificationBuilder() {
        reset();
    }

    public void with(FilterItem filterItem) {
        params.add(filterItem);
    }

    public Specification<RealtyObject> build() {
        if (params.isEmpty()) {
            return null;
        }

        List<Specification<RealtyObject>> specs = new ArrayList<>();
        for (FilterItem param : params) {
            specs.add(new RealtyObjectSpecification(param));
        }

        Specification<RealtyObject> result = specs.get(0);
        for (int i = 1; i < specs.size(); i++) {
            result = result.and(specs.get(i));
        }

        reset();
        return result;
    }

    private void reset() {
        params = new ArrayList<>();
    }
}
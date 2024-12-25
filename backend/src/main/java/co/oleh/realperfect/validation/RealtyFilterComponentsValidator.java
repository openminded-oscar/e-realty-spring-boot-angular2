package co.oleh.realperfect.validation;

import co.oleh.realperfect.realty.filtering.FilterItem;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RealtyFilterComponentsValidator implements ConstraintValidator<ValidRealtyFilterComponents, List<FilterItem>> {
    @Override
    public void initialize(ValidRealtyFilterComponents constraintAnnotation) {
    }

    @Override
    public boolean isValid(List<FilterItem> filterItems, ConstraintValidatorContext context) {
        if (filterItems == null) {
            return true;
        }
        boolean hasDescription = filterItems.stream()
                .anyMatch(item -> "description".equalsIgnoreCase(item.getField()));
        boolean hasRegion = filterItems.stream()
                .anyMatch(item -> FilterItem.REGION_FILTER_PATH.equalsIgnoreCase(item.getField()));
        return !hasDescription || hasRegion;
    }
}

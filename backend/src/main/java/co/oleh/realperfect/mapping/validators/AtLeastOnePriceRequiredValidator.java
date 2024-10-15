package co.oleh.realperfect.mapping.validators;

import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class AtLeastOnePriceRequiredValidator
        implements ConstraintValidator<AtLeastOnePriceRequired, RealtyObjectDetailsDto> {
    @Override
    public boolean isValid(RealtyObjectDetailsDto dto, ConstraintValidatorContext context) {
        return dto.getPrice() != null || dto.getPriceForRent() != null;
    }
}

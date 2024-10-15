package co.oleh.realperfect.mapping.validators;

import co.oleh.realperfect.mapping.validators.AtLeastOnePriceRequiredValidator;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = AtLeastOnePriceRequiredValidator.class)
@Target({ ElementType.TYPE })
@Retention(RetentionPolicy.RUNTIME)
public @interface AtLeastOnePriceRequired  {
    String message() default "At least one of price or priceForRent must be provided";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

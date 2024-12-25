package co.oleh.realperfect.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = RealtyFilterComponentsValidator.class)
@Target({ ElementType.METHOD, ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidRealtyFilterComponents {
    String message() default "If 'description' filter is present, 'region' filter must also be included.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

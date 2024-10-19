package co.oleh.realperfect.auth;

import co.oleh.realperfect.model.user.AccountCredentials;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
@AllArgsConstructor
public class CredentialsValidator implements Validator {
    private UserService userService;

    @Override
    public boolean supports(Class<?> aClass) {
        return AccountCredentials.class.equals(aClass);
    }

    @Override
    public void validate(Object o, Errors errors) {
        AccountCredentials user = (AccountCredentials) o;

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "login", "NotEmpty");
        if (user.getLogin().length() < 4 || user.getLogin().length() > 100) {
            errors.rejectValue("login", "Size.userForm.username");
        }
        if (userService.findByLogin(user.getLogin()) != null) {
            errors.rejectValue("login", "Duplicate.userForm.username");
        }

        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "NotEmpty");
        if (user.getPassword().length() < 4 || user.getPassword().length() > 32) {
            errors.rejectValue("password", "Size.userForm.password");
        }
    }
}
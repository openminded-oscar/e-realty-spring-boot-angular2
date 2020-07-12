package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.CredentialsValidator;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.model.AccountCredentials;
import co.oleh.realperfect.model.User;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(value = "/api/signup")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SignupApi {
  private UserService userService;

  private CredentialsValidator credentialsValidator;

  @InitBinder
  protected void initBinder(WebDataBinder binder) {
    binder.setValidator(credentialsValidator);
  }

  @PostMapping
  public User signup(@Valid @RequestBody AccountCredentials credentials) {
    User user = new User();
    user.setLogin(credentials.getLogin());
    user.setPassword(credentials.getPassword());
    userService.save(user);

    return user;
  }
}

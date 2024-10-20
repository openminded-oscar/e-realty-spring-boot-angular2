package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.CredentialsValidator;
import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.mapping.UserProfileDto;
import co.oleh.realperfect.mapping.UserSelfDto;
import co.oleh.realperfect.model.user.EmailPasswordDto;
import co.oleh.realperfect.model.user.User;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(value = "/api/user")
@AllArgsConstructor
public class UserApi {
  private UserService userService;

  private CredentialsValidator credentialsValidator;

  @InitBinder("credentials")
  protected void initBinder(WebDataBinder binder) {
    binder.setValidator(credentialsValidator);
  }

  @PostMapping
  public User create(@Valid @RequestBody EmailPasswordDto credentials) {
    User user = new User();

    user.setLogin(credentials.getEmail());
    user.setEmail(credentials.getEmail());
    user.setPassword(credentials.getPassword());
    userService.save(user);

    return user;
  }

  @PatchMapping
  public UserSelfDto updateMyProfile(@AuthenticationPrincipal SpringSecurityUser currentUser,
                                     @Valid @RequestBody UserProfileDto user) {
    return userService.patchProfile(currentUser.getId(), user);
  }
}

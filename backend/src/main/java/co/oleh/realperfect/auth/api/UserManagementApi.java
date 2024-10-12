package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.mapping.UserDto;
import co.oleh.realperfect.mapping.UserProfileDto;
import co.oleh.realperfect.mapping.UserSelfDto;
import co.oleh.realperfect.model.user.AccountCredentials;
import co.oleh.realperfect.model.user.User;
import lombok.AllArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(value = "/api/manage-users")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserManagementApi {
  private UserService userService;

  @GetMapping
  public UserDto list(@AuthenticationPrincipal SpringSecurityUser currentUser) {
    System.out.println("Lol");
    return null;
  }
}

package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.mapping.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;


@RestController
@RequestMapping(value = "/api/manage-users")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UserManagementApi {
  private UserService userService;

  @GetMapping
  @RolesAllowed({"ADMIN"})
  public UserDto list(@AuthenticationPrincipal SpringSecurityUser currentUser) {
    throw new RuntimeException("Not implemented yet!");
  }
}

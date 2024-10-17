package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.mapping.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import java.util.List;


@RestController
@RequestMapping(value = "/api/manage-users")
@AllArgsConstructor
public class UserManagementApi {
    private UserService userService;

    @GetMapping
    @RolesAllowed({"ADMIN"})
    public List<UserDto> list(@AuthenticationPrincipal SpringSecurityUser currentUser) {
        return this.userService.findAll();
    }

    @PostMapping(value = "set-realtor/{id}")
    @RolesAllowed({"ADMIN"})
    public UserDto setAsRealtor(@AuthenticationPrincipal SpringSecurityUser currentUser,
                              @PathVariable String id) {
        return this.userService.grantRealtorRole(id);
    }

    @DeleteMapping(value = "set-realtor/{id}")
    @RolesAllowed({"ADMIN"})
    public UserDto deleteAsRealtor(@AuthenticationPrincipal SpringSecurityUser currentUser,
                              @PathVariable String id) {
        return this.userService.removeRealtorRole(id);
    }
}

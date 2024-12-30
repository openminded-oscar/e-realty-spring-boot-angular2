package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.mapping.UserDto;
import lombok.AllArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.security.RolesAllowed;
import java.util.List;

import static co.oleh.realperfect.model.user.RoleUtils.ADMIN_ROLE;


@RestController
@RequestMapping(value = "/api/manage-users")
@AllArgsConstructor
public class UserManagementApi {
    private UserService userService;

    @GetMapping
    @RolesAllowed({ADMIN_ROLE})
    public List<UserDto> list(@AuthenticationPrincipal SpringSecurityUser currentUser) {
        return this.userService.findAll();
    }

    @PostMapping(value = "set-realtor/{id}")
    @RolesAllowed({ADMIN_ROLE})
    public UserDto setAsRealtor(@AuthenticationPrincipal SpringSecurityUser currentUser,
                              @PathVariable String id) {
        return this.userService.grantRealtorRole(id);
    }

    @DeleteMapping(value = "set-realtor/{id}")
    @RolesAllowed({ADMIN_ROLE})
    public UserDto deleteAsRealtor(@AuthenticationPrincipal SpringSecurityUser currentUser,
                              @PathVariable String id) {
        return this.userService.removeRealtorRole(id);
    }
}

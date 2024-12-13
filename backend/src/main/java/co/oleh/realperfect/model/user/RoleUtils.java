package co.oleh.realperfect.model.user;


import co.oleh.realperfect.auth.SpringSecurityUser;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class RoleUtils {
    public static final String USER_ROLE = "USER";
    public static final String ADMIN_ROLE = "ADMIN";
    public static final String REALTOR_ROLE = "REALTOR";
    public static final String ROLE_PREFIX  = "ROLE_";

    public static boolean containsAuthority(SpringSecurityUser user, String roleToCheck) {
        if (user == null || roleToCheck == null || roleToCheck.isBlank()) {
            return false;
        }

        String roleWithPrefix = ROLE_PREFIX + roleToCheck;

        Collection<GrantedAuthority> authorities = (Collection<GrantedAuthority>) user.getAuthorities();

        return authorities.stream()
                .anyMatch(authority -> authority.getAuthority().equals(roleWithPrefix));
    }
}
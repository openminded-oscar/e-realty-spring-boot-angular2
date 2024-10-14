package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.AuthenticationService;
import co.oleh.realperfect.auth.GoogleTokenVerifier;
import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.calendar.GoogleCalendarWrapperService;
import co.oleh.realperfect.mapping.MappingService;
import co.oleh.realperfect.mapping.UserSelfDto;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.user.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.annotation.RequestScope;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestScope
@RequestMapping(value = "/api/signin")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class SigninApi {

    private final UserService userService;
    private final MappingService mappingService;
    private final AuthenticationService tokenAuthenticationService;
    private final GoogleTokenVerifier googleTokenVerifier;
    private final GoogleCalendarWrapperService googleCalendarWrapper;

    public SigninApi(UserService userService,
                     MappingService mappingService,
                     AuthenticationService tokenAuthenticationService,
                     GoogleTokenVerifier googleTokenVerifier,
                     GoogleCalendarWrapperService googleCalendarWrapper) {
        this.userService = userService;
        this.mappingService = mappingService;
        this.tokenAuthenticationService = tokenAuthenticationService;
        this.googleTokenVerifier = googleTokenVerifier;
        this.googleCalendarWrapper = googleCalendarWrapper;
    }

    @GetMapping("/with-token")
    public UserSelfDto signedinWithToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = null;

        if (authentication != null) {
            if (authentication.getPrincipal() instanceof DefaultOidcUser) {
                DefaultOidcUser defaultOidcUser = (DefaultOidcUser) authentication.getPrincipal();
                user = userService.findByGoogleUserIdTokenSubject(defaultOidcUser.getSubject());
            } else if (authentication.getPrincipal() instanceof DefaultOAuth2User) {
                DefaultOAuth2User defaultOidcUser = (DefaultOAuth2User) authentication.getPrincipal();
                user = userService.findByGoogleUserIdTokenSubject((String) defaultOidcUser.getAttributes().get("sub"));
            } else if (authentication.getPrincipal() instanceof SpringSecurityUser) {
                Long userId = ((SpringSecurityUser) authentication.getPrincipal()).getId();
                user = userService.findById(userId);
            } else {
                return null;
            }
        } else {
            return null;
        }
        if (!user.getRealtyObjects().isEmpty()) {
            List<RealtyObject> sortedRealtyObjects = user.getRealtyObjects().stream()
                    .sorted(Comparator.comparing(RealtyObject::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                    .collect(Collectors.toList());
            user.setRealtyObjects(sortedRealtyObjects);
        }

        UserSelfDto userSelfDto = this.mappingService.map(user, UserSelfDto.class);
        userSelfDto.setRoles(
                new HashSet<>(user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toList()))
        );

        return userSelfDto;
    }

    @PostMapping
    public Token signIn(@RequestBody AccountCredentials credentials) {
        User user = userService.findUserAndVerify(credentials);
        String tokenString = tokenAuthenticationService.generateTokenBySubject(user.getId().toString());

        return new Token(tokenString);
    }

    @PostMapping("/google")
    public Token signInViaGoogle(@RequestBody GoogleAccountData googleAccountData) throws IOException, GeneralSecurityException {
        String tokenSubject = googleTokenVerifier.verifyGoogleTokenAndGetSubject(googleAccountData.getIdToken());

        User user = userService.findByGoogleUserIdTokenSubject(tokenSubject);
        if (user == null) {
            user = userService.createUserForGoogleTokenSubject(tokenSubject);
        }

        String tokenString = tokenAuthenticationService.generateTokenBySubject(user.getId().toString());

        return new Token(tokenString);
    }

}

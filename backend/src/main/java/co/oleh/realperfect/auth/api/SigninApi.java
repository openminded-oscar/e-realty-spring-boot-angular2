package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.AuthenticationService;
import co.oleh.realperfect.auth.GoogleTokenVerifier;
import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.calendar.GoogleCalendarWrapperService;
import co.oleh.realperfect.mapping.UserSelfDto;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.user.*;
import co.oleh.realperfect.realtor.RealtorService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.annotation.RequestScope;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static co.oleh.realperfect.model.user.RoleUtils.REALTOR_ROLE;

@RestController
@RequestScope
@RequestMapping(value = "/api/signin")
@Slf4j
public class SigninApi {
    private final UserService userService;
    private final RealtorService realtorService;
    private final MappingService mappingService;
    private final AuthenticationService tokenAuthenticationService;
    private final GoogleTokenVerifier googleTokenVerifier;

    public SigninApi(UserService userService,
                     RealtorService realtorService,
                     MappingService mappingService,
                     AuthenticationService tokenAuthenticationService,
                     GoogleTokenVerifier googleTokenVerifier,
                     GoogleCalendarWrapperService googleCalendarWrapper) {
        this.userService = userService;
        this.realtorService = realtorService;
        this.mappingService = mappingService;
        this.tokenAuthenticationService = tokenAuthenticationService;
        this.googleTokenVerifier = googleTokenVerifier;
    }

    @GetMapping("/with-token")
    public UserSelfDto signedinWithToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof SpringSecurityUser)) {
            return null;
        }

        Long userId = ((SpringSecurityUser) authentication.getPrincipal()).getId();
        User user = userService.findById(userId);
        if (user == null) {
            return null; // or throw a custom exception
        }

        // Sort RealtyObjects
        List<RealtyObject> sortedRealtyObjects = user.getRealtyObjects().stream()
                .sorted(Comparator.comparing(RealtyObject::getCreatedAt,
                        Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .collect(Collectors.toList());
        user.setRealtyObjects(sortedRealtyObjects);

        // Check if user is a Realtor
        boolean isRealtor = user.getRoles().stream()
                .anyMatch(role -> REALTOR_ROLE.equals(role.getName()));
        Realtor realtor = isRealtor ? realtorService.findRealtorByUserId(user.getId()) : null;

        // Map User to DTO
        UserSelfDto userSelfDto = mappingService.map(user, UserSelfDto.class);
        if (userSelfDto != null && realtor != null) {
            userSelfDto.setRealtorId(realtor.getId());
        }

        return userSelfDto;
    }


    @PostMapping
    public Token signIn(@RequestBody EmailPasswordDto credentials) {
        User user = userService.findUserByEmailAndVerifyPassword(credentials);
        if (!user.getUserConfirmed()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User email not confirmed");
        }

        String tokenString = tokenAuthenticationService.generateTokenBySubject(user.getId().toString());

        return new Token(tokenString);
    }

    @PostMapping("/google")
    public Token signInViaGoogle(@RequestBody GoogleAccountData googleAccountData) throws IOException,
            GeneralSecurityException {
        GoogleIdToken verifiedIdToken =
                googleTokenVerifier.verifyGoogleTokenAndGetSubject(googleAccountData.getIdToken());

        User user = userService.findByLogin(googleAccountData.getEmail());
        if (user == null) {
            user = userService.createUserForEmailAndGoogleTokenSubject(
                    googleAccountData.getEmail(),
                    verifiedIdToken.getPayload().getSubject()
            );
        } else {
            if (!user.getUserConfirmed()) {
                userService.confirmUser(user);
            }
        }

        String tokenString = tokenAuthenticationService.generateTokenBySubject(user.getId().toString());

        return new Token(tokenString);
    }
}

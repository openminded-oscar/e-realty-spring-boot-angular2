package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.AuthenticationService;
import co.oleh.realperfect.auth.GoogleTokenVerifier;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.calendar.GoogleCalendarWrapperService;
import co.oleh.realperfect.model.user.AccountCredentials;
import co.oleh.realperfect.model.user.GoogleAccountData;
import co.oleh.realperfect.model.user.Token;
import co.oleh.realperfect.model.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.annotation.RequestScope;

import java.io.IOException;
import java.security.GeneralSecurityException;

@RestController
@RequestScope
@RequestMapping(value = "/api/signin")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class SigninApi {

  private final UserService userService;
  private final AuthenticationService tokenAuthenticationService;
  private final GoogleTokenVerifier googleTokenVerifier;
  private final GoogleCalendarWrapperService googleCalendarWrapper;

  public SigninApi(UserService userService,
                   AuthenticationService tokenAuthenticationService,
                   GoogleTokenVerifier googleTokenVerifier,
                   GoogleCalendarWrapperService googleCalendarWrapper) {
    this.userService = userService;
    this.tokenAuthenticationService = tokenAuthenticationService;
    this.googleTokenVerifier = googleTokenVerifier;
    this.googleCalendarWrapper = googleCalendarWrapper;
  }

  @GetMapping("/with-token")
  public User signedinWithToken() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication != null) {
      if (authentication.getPrincipal() instanceof DefaultOidcUser) {
        DefaultOidcUser defaultOidcUser = (DefaultOidcUser) authentication.getPrincipal();
        return userService.findByGoogleUserIdTokenSubject(defaultOidcUser.getSubject());
      } else if (authentication.getPrincipal() instanceof String) {
        Long userId = Long.valueOf((String) authentication.getPrincipal());
        return userService.findById(userId);
      } else {
        return null;
      }
    } else {
      return null;
    }
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

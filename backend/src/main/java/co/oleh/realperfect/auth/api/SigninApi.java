package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.AuthenticationService;
import co.oleh.realperfect.auth.GoogleTokenVerifier;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.model.user.AccountCredentials;
import co.oleh.realperfect.model.user.GoogleAccountData;
import co.oleh.realperfect.model.user.Token;
import co.oleh.realperfect.model.user.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;

@RestController
@RequestMapping(value = "/api/signin")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class SigninApi {

  private final UserService userService;
  private final AuthenticationService tokenAuthenticationService;
  private final GoogleTokenVerifier googleTokenVerifier;

  public SigninApi(UserService userService,
                   AuthenticationService tokenAuthenticationService,
                   GoogleTokenVerifier googleTokenVerifier) {
    this.userService = userService;
    this.tokenAuthenticationService = tokenAuthenticationService;
    this.googleTokenVerifier = googleTokenVerifier;
  }

  @GetMapping("/with-token")
  public User signedinWithToken() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if(authentication != null) {
      Long userId = Long.valueOf((String) authentication.getPrincipal());
      return userService.findById(userId);
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
      user = createUserForGoogleTokenSubject(googleAccountData, tokenSubject);
    }

    String tokenString = tokenAuthenticationService.generateTokenBySubject(user.getId().toString());

    return new Token(tokenString);
  }

  private User createUserForGoogleTokenSubject(@RequestBody GoogleAccountData googleAccountData, String tokenSubject) {
    User user = new User();
    user.setPassword("");
    user.setEmail(googleAccountData.getEmail());
    user.setGoogleUserIdTokenSubject(tokenSubject);
    user = userService.save(user);
    return user;
  }
}

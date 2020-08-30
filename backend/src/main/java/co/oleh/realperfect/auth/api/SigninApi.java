package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.AuthenticationService;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.model.user.AccountCredentials;
import co.oleh.realperfect.model.user.GoogleAccountData;
import co.oleh.realperfect.model.user.Token;
import co.oleh.realperfect.model.user.User;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@RestController
@RequestMapping(value = "/api/signin")
@CrossOrigin(origins = "http://localhost:4200")
@Slf4j
public class SigninApi {

  private final UserService userService;
  private final AuthenticationService tokenAuthenticationService;

  @Value("${spring.security.oauth2.client.registration.google.client-id}")
  private final String clientId = null;

  @Autowired
  public SigninApi(UserService userService, AuthenticationService tokenAuthenticationService) {
    this.userService = userService;
    this.tokenAuthenticationService = tokenAuthenticationService;
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
    User user = userService.verify(credentials);
    String tokenString = tokenAuthenticationService.generateTokenBySubject(user.getId().toString());
    
    return new Token(tokenString);
  }

  @PostMapping("/google")
  public Token signInViaGoogle(@RequestBody GoogleAccountData googleAccountData) throws IOException, GeneralSecurityException {
    verifyGoogleToken(googleAccountData.getIdToken());

    User user = new User();
    user.setPassword("");
    user.setEmail(googleAccountData.getEmail());
    user.setGoogleUserIdToken(googleAccountData.getIdToken());
    // add new user here
    user = userService.save(user);

    String tokenString = tokenAuthenticationService.generateTokenBySubject(user.getId().toString());

    return new Token(tokenString);
  }

  private void verifyGoogleToken(String token) throws IOException, GeneralSecurityException {
      NetHttpTransport transport = new NetHttpTransport();
      JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();

      GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
              .setAudience(Collections.singletonList(clientId))
              .build();

      GoogleIdToken idToken = GoogleIdToken.parse(verifier.getJsonFactory(), token);
      boolean tokenIsValid = (idToken != null) && verifier.verify(idToken);

      if (!tokenIsValid) {
        throw new RuntimeException("Google token is not valid!");
      }
  }
}

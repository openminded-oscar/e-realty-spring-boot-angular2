package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.AuthenticationService;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.model.AccountCredentials;
import co.oleh.realperfect.model.Token;
import co.oleh.realperfect.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/signin")
@CrossOrigin(origins = "http://localhost:4200")
public class SigninApi {

  private final UserService userService;
  private final AuthenticationService tokenAuthenticationService;

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
}

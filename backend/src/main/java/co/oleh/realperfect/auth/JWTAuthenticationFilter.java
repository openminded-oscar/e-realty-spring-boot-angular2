package co.oleh.realperfect.auth;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

@Component
public class JWTAuthenticationFilter extends GenericFilterBean {

  private final AuthenticationService authenticationService;

  @Autowired
  public JWTAuthenticationFilter(AuthenticationService authenticationService) {
    this.authenticationService = authenticationService;
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    // get token from request (frontend)
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    // or get it from response (header previously set in CustomOauthFilter.class - oauth redirect)
    HttpServletResponse httpResponse = (HttpServletResponse) response;
    // TODO try extract from response

    Authentication authentication =
        authenticationService.getAuthentication(httpRequest);
    // TODO add parsing from request

    SecurityContextHolder.getContext().setAuthentication(authentication);
    chain.doFilter(request, response);
  }
}

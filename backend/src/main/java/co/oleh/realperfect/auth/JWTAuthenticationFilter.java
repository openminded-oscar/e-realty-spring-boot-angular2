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
import org.springframework.web.server.ResponseStatusException;

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
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    if (SecurityContextHolder.getContext().getAuthentication() == null) {
      try {
        Authentication authentication = authenticationService.getAuthentication(httpRequest);
        if (authentication == null) {
          authentication = authenticationService.getGoogleAuthentication(httpRequest);
        }
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } catch (ResponseStatusException ex) {
        ((HttpServletResponse) response).sendError(ex.getStatus().value(), ex.getReason());
        return;
      }
    }
    chain.doFilter(request, response);
  }
}

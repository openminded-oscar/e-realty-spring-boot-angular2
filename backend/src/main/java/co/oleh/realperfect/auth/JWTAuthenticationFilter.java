package co.oleh.realperfect.auth;

import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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
        SecurityContextHolder.getContext().setAuthentication(authentication);
      } catch (ResponseStatusException ex) {
        ((HttpServletResponse) response).sendError(ex.getStatusCode().value(), ex.getReason());
        return;
      }
    }
    chain.doFilter(request, response);
  }
}

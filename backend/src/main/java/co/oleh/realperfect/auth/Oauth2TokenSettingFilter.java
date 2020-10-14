package co.oleh.realperfect.config.oauth;

import co.oleh.realperfect.auth.AuthenticationService;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.model.user.User;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class Oauth2TokenSettingFilter extends GenericFilterBean {
    private AuthenticationService authenticationService;
    private UserService userService;
    private OAuth2AuthorizedClientRepository authorizedClientRepository;


    public Oauth2TokenSettingFilter(AuthenticationService authenticationService,
                                    OAuth2AuthorizedClientRepository authorizedClientRepository,
                                    UserService userService) {
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.authorizedClientRepository = authorizedClientRepository;
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof OAuth2AuthenticationToken) {
            HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
            DefaultOidcUser principal = (DefaultOidcUser) authentication.getPrincipal();
            String subject = principal.getSubject();

            User user = userService.findByGoogleUserIdTokenSubject(subject);
            if (user == null) {
                userService.createUserForGoogleTokenSubject(subject);
            }

            String tokenByGoogleSubject = authenticationService.generateTokenBySubject(subject);
            Cookie cookie = new Cookie("GOOGLE_OAUTH_TOKEN", tokenByGoogleSubject);
            cookie.setSecure(true);
            httpServletResponse.addCookie(cookie);
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}

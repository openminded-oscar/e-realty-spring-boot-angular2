package co.oleh.realperfect.auth;

import co.oleh.realperfect.model.user.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

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

            String subject = null;
            if(authentication.getPrincipal() instanceof DefaultOAuth2User) {
                subject = (String) ((DefaultOAuth2User)authentication.getPrincipal()).getAttributes().get("sub");
            } else if (authentication.getPrincipal() instanceof DefaultOidcUser) {
                subject = ((DefaultOidcUser) authentication.getPrincipal()).getSubject();
            }
            if (subject != null) {
                User user = userService.findByGoogleUserIdTokenSubject(subject);
                if (user == null) {
                    userService.createUserForGoogleTokenSubject(subject);
                }
            }

            String tokenByGoogleSubject = authenticationService.generateTokenBySubject(subject);
            Cookie cookie = new Cookie("GOOGLE_OAUTH_TOKEN", tokenByGoogleSubject);
            httpServletResponse.addCookie(cookie);
        }

        filterChain.doFilter(servletRequest, servletResponse);
    }
}

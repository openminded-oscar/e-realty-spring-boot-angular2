package co.oleh.realperfect.auth;

import co.oleh.realperfect.model.user.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AuthenticationService {
    private OAuth2AuthorizedClientService authorizedClientService;

    @Value("${jwt.secret}")
    private final String secret = null;
    private final UserService userService;

    public AuthenticationService(UserService userService, OAuth2AuthorizedClientService authorizedClientService) {
        this.userService = userService;
    }

    public Authentication getAuthentication(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header != null && !header.isEmpty()) {
            Optional<String> userIdFromToken = this.parseJwt(header);
            if (userIdFromToken.isPresent()) {
                User userInDb = this.userService.findById(Long.valueOf(userIdFromToken.get()));
                List<SimpleGrantedAuthority> roles =
                        userInDb.getRoles()
                                .stream()
                                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName()))
                                .collect(Collectors.toList());
                SpringSecurityUser user =
                        new SpringSecurityUser(userInDb.getId(), userInDb.getLogin(), userInDb.getEmail(), roles);
                return new UsernamePasswordAuthenticationToken(user, null, roles);
            }
        }

        return null;
    }

    public Authentication getGoogleAuthentication(HttpServletRequest request) {
        String header = request.getHeader("GAuthorization");

        if (header != null && !header.isEmpty()) {
            Optional<String> parsedToken = this.parseJwt(header);
            if (parsedToken.isPresent()) {
//                OAuth2AuthorizedClient oAuth2AuthorizedClient = authorizedClientService.loadAuthorizedClient("google", parsedToken.get());
//                OAuth2AccessToken oAuth2AccessToken = oAuth2AuthorizedClient.getAccessToken();
//                String principalName = oAuth2AuthorizedClient.getPrincipalName();
                return new OAuth2AuthenticationToken(new DefaultOAuth2User(new ArrayList<GrantedAuthority>() {{
                    add(new SimpleGrantedAuthority("ROLE_USER"));
                }}, new HashMap<String, Object>() {{
                    put("sub", parsedToken.get());
                }}, "sub"), null, "google");
//                return oAuth2AuthorizedClient.getAccessToken();
            }
        }

        return null;
    }

    public String generateTokenBySubject(String subject) {
        return this.generateJWT(subject);
    }

    private String generateJWT(final String subject) {
        return Jwts.builder()
                .setSubject(subject)
//                .setExpiration(new Date(System.currentTimeMillis() + (expirationTime * 1000)))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    private Optional<String> parseJwt(String token) {
        try {
            return Optional.ofNullable(
                    Jwts.parser()
                            .setSigningKey(secret)
                            .parseClaimsJws(token.replace("Bearer ", ""))
                            .getBody()
                            .getSubject());
        } catch (Exception e) {
            log.error("Error parsing jwt token: {}", token, e);
            return Optional.empty();
        }
    }
}

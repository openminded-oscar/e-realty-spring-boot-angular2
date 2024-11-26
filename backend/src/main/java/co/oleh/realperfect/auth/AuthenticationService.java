package co.oleh.realperfect.auth;

import co.oleh.realperfect.model.user.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static co.oleh.realperfect.model.user.RoleUtils.ROLE_PREFIX;

@Service
@Slf4j
public class AuthenticationService {
    @Value("${jwt.secret}")
    private final String secret = null;
    private final UserService userService;

    public AuthenticationService(UserService userService) {
        this.userService = userService;
    }

    public Authentication getAuthentication(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header != null && !header.isEmpty()) {
            Optional<String> userIdFromToken = this.parseJwt(header);
            if (userIdFromToken.isPresent()) {
                User userInDb = this.userService.findByIdCacheable(Long.valueOf(userIdFromToken.get()));

                if (userInDb == null || !userInDb.getUserConfirmed()) {
                    throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Confirmed User not found with this email");
                }
                List<SimpleGrantedAuthority> roles =
                        userInDb.getRoles()
                                .stream()
                                .map(r -> new SimpleGrantedAuthority(ROLE_PREFIX + r.getName()))
                                .collect(Collectors.toList());
                SpringSecurityUser user =
                        new SpringSecurityUser(userInDb.getId(), userInDb.getLogin(), userInDb.getEmail(), roles);
                return new UsernamePasswordAuthenticationToken(user, null, roles);
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

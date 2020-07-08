package co.oleh.realperfect.auth;

import static java.util.Collections.emptyList;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AuthenticationService {
    @Value("${jwt.secret}")
    private final String secret = null;

    public Authentication getAuthentication(HttpServletRequest request) {
        return Optional.ofNullable(request.getHeader("Authorization"))
                .filter(header -> !header.isEmpty())
                .flatMap(this::parseJwt)
                .map(userId -> new UsernamePasswordAuthenticationToken(userId, null, emptyList()))
                .orElse(null);
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

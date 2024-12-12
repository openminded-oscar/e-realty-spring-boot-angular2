package co.oleh.realperfect.config;

import co.oleh.realperfect.auth.JWTAuthenticationFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(jsr250Enabled = true)
public class SecurityConfiguration {
    private final JWTAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfiguration(JWTAuthenticationFilter jwtAuthenticationFilter) {
        super();
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable session creation (stateless)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Configure request authorization
                .authorizeHttpRequests(auth -> auth
                        // Public OPTIONS requests
                        .requestMatchers(HttpMethod.OPTIONS).permitAll()

                        // Private endpoints
                        .requestMatchers(
                                "/api/upload-photo/**",
                                "/api/interest/**",
                                "/api/object-review/**",
                                "/api/manage-users"
                        ).authenticated()
                        .requestMatchers(HttpMethod.POST, "/realty-objects/save").authenticated()

                        // Public endpoints
                        .requestMatchers(
                                "/api/**",
                                "/error",
                                "/login/oauth2/**",
                                "/index.html",
                                "/"
                        ).permitAll()
                )

                // Add custom filters
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

                // Disable CSRF
                .csrf(AbstractHttpConfigurer::disable)

                // Exception handling
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(new RestAuthenticationEntryPoint())
                );

        return http.build();
    }

    public static class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {
        @Override
        public void commence(
                HttpServletRequest request,
                HttpServletResponse response,
                AuthenticationException authException)
                throws IOException {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }
}
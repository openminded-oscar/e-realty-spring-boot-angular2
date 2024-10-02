package co.oleh.realperfect.config;

import co.oleh.realperfect.auth.JWTAuthenticationFilter;
import co.oleh.realperfect.config.oauth.CustomAuthorizationRequestRepository;
import co.oleh.realperfect.config.oauth.Oauth2TokenSettingFilter;
import co.oleh.realperfect.config.oauth.ScopeAwareOAuth2AuthorizationRequestResolver;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.endpoint.*;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

// TODO try to modify OAuth2AuthorizationCodeGrantFilter

@Configuration
@EnableOAuth2Sso
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
    private JWTAuthenticationFilter jwtAuthenticationFilter;
    private Oauth2TokenSettingFilter oauth2TokenSettingFilter;
    private ScopeAwareOAuth2AuthorizationRequestResolver oAuth2AuthorizationRequestResolver;

    public SecurityConfiguration(JWTAuthenticationFilter jwtAuthenticationFilter,
                                 ScopeAwareOAuth2AuthorizationRequestResolver oAuth2AuthorizationRequestResolver,
                                 Oauth2TokenSettingFilter oauth2TokenSettingFilter) {
        super();
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.oAuth2AuthorizationRequestResolver = oAuth2AuthorizationRequestResolver;
        this.oauth2TokenSettingFilter = oauth2TokenSettingFilter;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                // api endpoints security policy
                .antMatchers(HttpMethod.OPTIONS)
                .permitAll()
                // TODO add secured endpoints here
                .antMatchers("/api/**", "/login/oauth2/**", "/index.html", "/")
                .permitAll()
                .antMatchers("/api/upload-photo/**", "/api/object-review/**")
                .authenticated()
                .and()
                // authentication filter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterAfter(oauth2TokenSettingFilter, OAuth2LoginAuthenticationFilter.class)
                .csrf()
                .disable()
                .exceptionHandling()
                .authenticationEntryPoint(new RestAuthenticationEntryPoint())
                .and()
                // oauth
                .oauth2Login()
                .authorizationEndpoint()
                .authorizationRequestRepository(authorizationRequestRepository())
                .authorizationRequestResolver(this.oAuth2AuthorizationRequestResolver)
                .and()
                .tokenEndpoint()
                .accessTokenResponseClient(accessTokenResponseClient());


        http.oauth2Client();
    }

    @Bean
    public OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest> accessTokenResponseClient() {
        return new DefaultAuthorizationCodeTokenResponseClient();
    }

    @Bean
    public AuthorizationRequestRepository<OAuth2AuthorizationRequest> authorizationRequestRepository() {
        return new CustomAuthorizationRequestRepository();
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
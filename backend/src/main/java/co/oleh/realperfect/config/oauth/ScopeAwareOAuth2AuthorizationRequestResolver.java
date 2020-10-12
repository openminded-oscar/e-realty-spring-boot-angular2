package co.oleh.realperfect.config.oauth;

import java.util.*;
import javax.servlet.http.HttpServletRequest;

import org.springframework.security.crypto.keygen.Base64StringKeyGenerator;
import org.springframework.security.crypto.keygen.StringKeyGenerator;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest.Builder;
import org.springframework.security.web.util.UrlUtils;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;
import org.springframework.web.util.UriComponentsBuilder;

@Component
/**
 * This resolver can resolve custom scope out of 'scope' request parameter
 */
public class ScopeAwareOAuth2AuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {
    private final ClientRegistrationRepository clientRegistrationRepository;
    private final AntPathRequestMatcher authorizationRequestMatcher;
    private final StringKeyGenerator stateGenerator = new Base64StringKeyGenerator(Base64.getUrlEncoder());

    private final String authorizationRequestBaseUri = "/oauth2/authorize-client";

    private final Map<String, String> googleAllowedScopes = new HashMap<String, String>() {{
        put("email", "email");
        put("profile", "profile");
        put("openid", "openid");
        put("calendar", "https://www.googleapis.com/auth/calendar");
    }};

    public ScopeAwareOAuth2AuthorizationRequestResolver(ClientRegistrationRepository clientRegistrationRepository) {
        Assert.notNull(clientRegistrationRepository, "clientRegistrationRepository cannot be null");
        this.clientRegistrationRepository = clientRegistrationRepository;
        this.authorizationRequestMatcher = new AntPathRequestMatcher(authorizationRequestBaseUri + "/{" + "registrationId" + "}");
    }

    public OAuth2AuthorizationRequest resolve(HttpServletRequest request) {
        String registrationId = this.resolveRegistrationId(request);
        String redirectUriAction = this.getAction(request, "login");
        return this.resolve(request, registrationId, redirectUriAction);
    }

    public OAuth2AuthorizationRequest resolve(HttpServletRequest request, String registrationId) {
        if (registrationId == null) {
            return null;
        } else {
            String redirectUriAction = this.getAction(request, "authorize");
            return this.resolve(request, registrationId, redirectUriAction);
        }
    }

    private String getAction(HttpServletRequest request, String defaultAction) {
        String action = request.getParameter("action");
        return action == null ? defaultAction : action;
    }

    private OAuth2AuthorizationRequest resolve(HttpServletRequest request, String registrationId, String redirectUriAction) {
        if (registrationId == null) {
            return null;
        } else {
            ClientRegistration clientRegistration = this.clientRegistrationRepository.findByRegistrationId(registrationId);
            if (clientRegistration == null) {
                throw new IllegalArgumentException("Invalid Client Registration with Id: " + registrationId);
            } else {
                Builder builder;
                if (AuthorizationGrantType.AUTHORIZATION_CODE.equals(clientRegistration.getAuthorizationGrantType())) {
                    builder = OAuth2AuthorizationRequest.authorizationCode();
                } else {
                    if (!AuthorizationGrantType.IMPLICIT.equals(clientRegistration.getAuthorizationGrantType())) {
                        throw new IllegalArgumentException("Invalid Authorization Grant Type (" + clientRegistration.getAuthorizationGrantType().getValue() + ") for Client Registration with Id: " + clientRegistration.getRegistrationId());
                    }

                    builder = OAuth2AuthorizationRequest.implicit();
                }

                String redirectUriStr = this.expandRedirectUri(request, clientRegistration, redirectUriAction);
                Map<String, Object> additionalParameters = new HashMap();
                additionalParameters.put("registration_id", clientRegistration.getRegistrationId());

                Set<String> scopes = getScopes(request, clientRegistration);
                OAuth2AuthorizationRequest authorizationRequest = builder.clientId(clientRegistration.getClientId()).authorizationUri(clientRegistration.getProviderDetails().getAuthorizationUri()).redirectUri(redirectUriStr).scopes(scopes).state(this.stateGenerator.generateKey()).additionalParameters(additionalParameters).build();
                return authorizationRequest;
            }
        }
    }

    private Set<String> getScopes(HttpServletRequest request, ClientRegistration clientRegistration) {
        Set<String> scopes = new HashSet<>();

        String scopeParam = request.getParameter("scope");
        if (scopeParam != null) {
            if(clientRegistration.getRegistrationId().equalsIgnoreCase("google")) {
                Arrays.asList(scopeParam.split(" ")).forEach((String scope) -> {
                    if (googleAllowedScopes.containsKey(scope))
                        scopes.add(googleAllowedScopes.get(scope));
                });
            }
            // TODO add support for other providers than google
        }


        if (scopes.isEmpty()) {
            return clientRegistration.getScopes();
        } else {
            return scopes;
        }
    }

    private String resolveRegistrationId(HttpServletRequest request) {
        return this.authorizationRequestMatcher.matches(request) ? (String)this.authorizationRequestMatcher.extractUriTemplateVariables(request).get("registrationId") : null;
    }

    private String expandRedirectUri(HttpServletRequest request, ClientRegistration clientRegistration, String action) {
        Map<String, String> uriVariables = new HashMap();
        uriVariables.put("registrationId", clientRegistration.getRegistrationId());
        String baseUrl = UriComponentsBuilder.fromHttpUrl(UrlUtils.buildFullRequestUrl(request)).replaceQuery((String)null).replacePath(request.getContextPath()).build().toUriString();
        uriVariables.put("baseUrl", baseUrl);
        if (action != null) {
            uriVariables.put("action", action);
        }

        return UriComponentsBuilder.fromUriString(clientRegistration.getRedirectUriTemplate()).buildAndExpand(uriVariables).toUriString();
    }
}

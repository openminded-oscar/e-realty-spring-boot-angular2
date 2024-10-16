package co.oleh.realperfect.config.oauth;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.util.Assert;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

// TODO complete this class and store everything  to a map
public class CustomAuthorizationRequestRepository  implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {
    private final String sessionAttributeName = HttpSessionOAuth2AuthorizationRequestRepository.class.getName() + ".AUTHORIZATION_REQUEST";
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        Principal user = (Principal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Assert.notNull(request, "request cannot be null");
        String stateParameter = this.getStateParameter(request);
        if (stateParameter == null) {
            return null;
        } else {
            Map<String, OAuth2AuthorizationRequest> authorizationRequests = this.getAuthorizationRequests(request);
            return (OAuth2AuthorizationRequest) authorizationRequests.get(stateParameter);
        }
    }

    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest, HttpServletRequest request, HttpServletResponse response) {
        Assert.notNull(request, "request cannot be null");
        Assert.notNull(response, "response cannot be null");
        if (authorizationRequest == null) {
            this.removeAuthorizationRequest(request, response);
        } else {
            String state = authorizationRequest.getState();
            Assert.hasText(state, "authorizationRequest.state cannot be empty");
            Map<String, OAuth2AuthorizationRequest> authorizationRequests = this.getAuthorizationRequests(request);
            authorizationRequests.put(state, authorizationRequest);
            request.getSession().setAttribute(this.sessionAttributeName, authorizationRequests);
        }
    }

    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request) {
        Assert.notNull(request, "request cannot be null");
        String stateParameter = this.getStateParameter(request);
        if (stateParameter == null) {
            return null;
        } else {
            Map<String, OAuth2AuthorizationRequest> authorizationRequests = this.getAuthorizationRequests(request);
            OAuth2AuthorizationRequest originalRequest = (OAuth2AuthorizationRequest) authorizationRequests.remove(stateParameter);
            if (!authorizationRequests.isEmpty()) {
                request.getSession().setAttribute(this.sessionAttributeName, authorizationRequests);
            } else {
                request.getSession().removeAttribute(this.sessionAttributeName);
            }

            return originalRequest;
        }
    }

    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request, HttpServletResponse response) {
        Assert.notNull(response, "response cannot be null");
        return this.removeAuthorizationRequest(request);
    }

    private String getStateParameter(HttpServletRequest request) {
        return request.getParameter("state");
    }

    private Map<String, OAuth2AuthorizationRequest> getAuthorizationRequests(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Map<String, OAuth2AuthorizationRequest> authorizationRequests = session == null ? null : (Map) session.getAttribute(this.sessionAttributeName);
        return authorizationRequests == null ? new HashMap<>() : authorizationRequests;
    }
}

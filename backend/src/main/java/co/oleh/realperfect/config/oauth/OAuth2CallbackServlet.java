package co.oleh.realperfect.config.oauth;

import com.google.api.client.auth.oauth2.AuthorizationCodeFlow;
import com.google.api.client.auth.oauth2.AuthorizationCodeResponseUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.servlet.auth.oauth2.AbstractAuthorizationCodeCallbackServlet;
import com.google.appengine.api.users.UserServiceFactory;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class OAuth2CallbackServlet extends AbstractAuthorizationCodeCallbackServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void onSuccess(HttpServletRequest req, HttpServletResponse resp, Credential credential)
            throws IOException {
        resp.sendRedirect("/");
    }

    @Override
    protected void onError(
            HttpServletRequest req, HttpServletResponse resp, AuthorizationCodeResponseUrl errorResponse)
            throws IOException {
        String nickname = UserServiceFactory.getUserService().getCurrentUser().getNickname();
        resp.getWriter().print("<h1>" + nickname + ", why don't you want to play with me?</h1>");
        resp.setStatus(200);
        resp.addHeader("Content-Type", "text/html");
    }

    @Override
    protected String getRedirectUri(HttpServletRequest req) {
        return Utils.getRedirectUri(req);
    }

    @Override
    protected String getUserId(HttpServletRequest httpServletRequest) throws ServletException, IOException {
        return null;
    }

    @Override
    protected AuthorizationCodeFlow initializeFlow() throws IOException {
        return Utils.newFlow();
    }
}

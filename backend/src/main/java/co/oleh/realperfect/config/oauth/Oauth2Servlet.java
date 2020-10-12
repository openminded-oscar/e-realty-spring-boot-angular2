package co.oleh.realperfect.config.oauth;

import com.google.api.client.auth.oauth2.AuthorizationCodeFlow;
import com.google.api.client.extensions.servlet.auth.oauth2.AbstractAuthorizationCodeServlet;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.CalendarScopes;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;

public class Oauth2Servlet extends AbstractAuthorizationCodeServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        // do stuff
    }

    @Override
    protected String getRedirectUri(HttpServletRequest req) throws ServletException, IOException {
        GenericUrl url = new GenericUrl(req.getRequestURL().toString());
        url.setRawPath("/oauth2callback");
        return url.build();
    }

    @Override
    protected AuthorizationCodeFlow initializeFlow() throws IOException {
        return new GoogleAuthorizationCodeFlow.Builder(
                new NetHttpTransport(), JacksonFactory.getDefaultInstance(),
                "510686946042-rijrprort52tnmpm0e0ir20qgngt9cha.apps.googleusercontent.com", "l7S8q_gtEURetxXoQlhXTiGT",
                Collections.singleton(CalendarScopes.CALENDAR))
                .setDataStoreFactory(
                null)
                .setAccessType("offline")
                .build();
    }

    @Override
    protected String getUserId(HttpServletRequest req) throws ServletException, IOException {
        // return user ID
        return "sample";
    }
}
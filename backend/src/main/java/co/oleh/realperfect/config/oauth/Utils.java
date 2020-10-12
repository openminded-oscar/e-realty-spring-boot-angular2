package co.oleh.realperfect.config.oauth;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.extensions.appengine.http.UrlFetchTransport;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.Preconditions;
import com.google.api.client.util.store.DataStoreFactory;
import com.google.api.client.util.store.MemoryDataStoreFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.appengine.api.users.UserServiceFactory;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Collections;

import javax.servlet.http.HttpServletRequest;

class Utils {

    /**
     * Global instance of the {@link DataStoreFactory}. The best practice is to make it a single
     * globally shared instance across your application.
     */
    private static final DataStoreFactory DATA_STORE_FACTORY =
            MemoryDataStoreFactory.getDefaultInstance();

    /** Global instance of the HTTP transport. */
    static final HttpTransport HTTP_TRANSPORT = new UrlFetchTransport();

    /** Global instance of the JSON factory. */
    static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    private static GoogleClientSecrets clientSecrets = null;

    static GoogleClientSecrets getClientCredential() throws IOException {
        if (clientSecrets == null) {
            clientSecrets = GoogleClientSecrets.load(JSON_FACTORY,
                    new InputStreamReader(Utils.class.getResourceAsStream("/client_secrets.json")));
            Preconditions.checkArgument(!clientSecrets.getDetails().getClientId().startsWith("Enter ")
                            && !clientSecrets.getDetails().getClientSecret().startsWith("Enter "),
                    "Download client_secrets.json file from https://code.google.com/apis/console/"
                            + "?api=calendar into calendar-appengine-sample/src/main/resources/client_secrets.json");
        }
        return clientSecrets;
    }

    static String getRedirectUri(HttpServletRequest req) {
        GenericUrl url = new GenericUrl(req.getRequestURL().toString());
        url.setRawPath("/oauth2callback");
        return url.build();
    }

    static GoogleAuthorizationCodeFlow newFlow() throws IOException {
        return new GoogleAuthorizationCodeFlow.Builder(HTTP_TRANSPORT, JSON_FACTORY,
                getClientCredential(), Collections.singleton(CalendarScopes.CALENDAR))
                .setDataStoreFactory(DATA_STORE_FACTORY)
                .setAccessType("offline")
                .build();
    }

    static Calendar loadCalendarClient() throws IOException {
        String userId = UserServiceFactory.getUserService().getCurrentUser().getUserId();
        Credential credential = newFlow().loadCredential(userId);
        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential).build();
    }

    /**
     * Returns an {@link IOException} (but not a subclass) in order to work around restrictive GWT
     * serialization policy.
     */
    static IOException wrappedIOException(IOException e) {
        if (e.getClass() == IOException.class) {
            return e;
        }
        return new IOException(e.getMessage());
    }

    private Utils() {
    }
}
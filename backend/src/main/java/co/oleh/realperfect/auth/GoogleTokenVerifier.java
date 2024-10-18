package co.oleh.realperfect.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@Component
public class GoogleTokenVerifier {
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private final String clientId = null;

    private GoogleIdTokenVerifier verifier;
    private JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();

    @PostConstruct
    private void init() {
        jsonFactory = JacksonFactory.getDefaultInstance();
        NetHttpTransport transport = new NetHttpTransport();

        verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    public GoogleIdToken verifyGoogleTokenAndGetSubject(String token) throws IOException, GeneralSecurityException {
        GoogleIdToken idToken = GoogleIdToken.parse(jsonFactory, token);
        boolean tokenIsValid = (idToken != null) && verifier.verify(idToken);

        if (!tokenIsValid) {
            throw new RuntimeException("Google token is not valid!");
        } else {
            return idToken;
        }
    }
}

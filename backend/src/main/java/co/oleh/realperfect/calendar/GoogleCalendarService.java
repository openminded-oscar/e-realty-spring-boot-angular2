package co.oleh.realperfect.calendar;

import java.security.Principal;

import com.google.api.services.calendar.Calendar;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;

public class GoogleCalendarService {
	
	private static final String APPLICATION_NAME = "Real Perfect";
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static HttpTransport HTTP_TRANSPORT;

    static {
        try {
            HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();
        } catch (Throwable t) {
            t.printStackTrace();
            System.exit(1);
        }
    }
    
    public static Calendar get(Principal principal){
		Credential credential = new Credential(BearerToken.authorizationHeaderAccessMethod());
        credential.setAccessToken(GoogleCalendarService.getAccessToken(principal));
        return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential).setApplicationName(APPLICATION_NAME).build();
	}
	
	static private String getAccessToken(Principal principal){
		OAuth2Authentication authentication = (OAuth2Authentication)principal;
		OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails)authentication.getDetails();
		return details.getTokenValue();
	}
}
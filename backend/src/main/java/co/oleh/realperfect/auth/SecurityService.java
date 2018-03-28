package co.oleh.realperfect.auth;

public interface SecurityService {
    String findLoggedInUsername();

    void autologin(String username, String password);
}

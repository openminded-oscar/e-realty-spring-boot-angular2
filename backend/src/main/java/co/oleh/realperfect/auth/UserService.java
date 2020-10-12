package co.oleh.realperfect.auth;

import co.oleh.realperfect.model.user.AccountCredentials;
import co.oleh.realperfect.model.user.User;

public interface UserService {
    User save(User user);

    User findById(Long id);

    User findByLogin(String username);

    User findByGoogleUserIdTokenSubject(String username);

    User findUserAndVerify(AccountCredentials authentication);

    User createUserForGoogleTokenSubject(String tokenSubject);
}
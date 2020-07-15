package co.oleh.realperfect.auth;

import co.oleh.realperfect.model.AccountCredentials;
import co.oleh.realperfect.model.User;

public interface UserService {
    void save(User user);

    User findById(Long id);

    User findByLogin(String username);

    User verify(AccountCredentials authentication);
}
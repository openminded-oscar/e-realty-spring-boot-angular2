package co.oleh.realperfect.auth;

import co.oleh.realperfect.model.User;

public interface UserService {
    void save(User user);

    User findByLogin(String username);
}
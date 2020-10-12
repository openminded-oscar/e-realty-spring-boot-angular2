package co.oleh.realperfect.auth;

import co.oleh.realperfect.model.user.AccountCredentials;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.repository.RoleRepository;
import co.oleh.realperfect.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public User save(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRoles(new HashSet<>(roleRepository.findAll()));
        return userRepository.save(user);
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User findByGoogleUserIdTokenSubject(String googleUserId) {
        return userRepository.findByGoogleUserIdTokenSubject(googleUserId).orElse(null);
    }

    @Override
    public User findByLogin(String login) {
        return userRepository.findByLogin(login).orElse(null);
    }

    public User createUserForGoogleTokenSubject(String tokenSubject) {
        User user = new User();
        user.setPassword("");
        user.setGoogleUserIdTokenSubject(tokenSubject);

        return save(user);
    }

    public User findUserAndVerify(AccountCredentials authentication) {
        Optional<User> maybeUser = userRepository.findByLogin(authentication.getLogin());
        if (!maybeUser.isPresent()) {
            throw new RuntimeException("User doesn't exist with this username");
        }

        User user = maybeUser.get();

        boolean isPasswordValid =
                bCryptPasswordEncoder.matches(authentication.getPassword(), user.getPassword());
        if (!isPasswordValid) {
            throw new RuntimeException("Login and password do not match");
        }
        return maybeUser.get();
    }
}
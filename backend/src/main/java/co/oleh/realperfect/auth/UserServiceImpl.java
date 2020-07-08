package co.oleh.realperfect.auth;

import co.oleh.realperfect.model.AccountCredentials;
import co.oleh.realperfect.model.User;
import co.oleh.realperfect.repository.RoleRepository;
import co.oleh.realperfect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void save(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRoles(new HashSet<>(roleRepository.findAll()));
        userRepository.save(user);
    }

    @Override
    public User findByLogin(String login) {
        return userRepository.findByLogin(login).orElse(null);
    }

    public User verify(AccountCredentials authentication) {
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
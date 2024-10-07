package co.oleh.realperfect.auth;

import co.oleh.realperfect.mapping.MappingService;
import co.oleh.realperfect.mapping.UserDto;
import co.oleh.realperfect.mapping.UserProfileDto;
import co.oleh.realperfect.mapping.UserSelfDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import co.oleh.realperfect.model.user.AccountCredentials;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.repository.RoleRepository;
import co.oleh.realperfect.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {
    private MappingService mappingService;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserSelfDto patchProfile(Long id, UserProfileDto userDto) {
        User user = this.userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        mergePatch(userDto, user);

        User updatedUser = userRepository.save(user);
        return this.mappingService.map(updatedUser, UserSelfDto.class);
    }

    @Override
    public User save(User user) {
        if (this.userRepository.findByLogin(user.getLogin()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists!");
        }

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
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login and password do not match");
        }
        return maybeUser.get();
    }

    private void mergePatch(UserProfileDto patchDto, User existingUser) {
        if (patchDto.getName() != null) {
            existingUser.setName(patchDto.getName());
        }
        if (patchDto.getSurname() != null) {
            existingUser.setSurname(patchDto.getSurname());
        }
        if (patchDto.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(patchDto.getPhoneNumber());
        }
        if (patchDto.getEmail() != null) {
            existingUser.setEmail(patchDto.getEmail());
        }
        if (patchDto.getProfilePic() != null) {
            existingUser.setProfilePic(patchDto.getProfilePic().getFilename());
        } else {
            existingUser.setProfilePic(null);
        }
    }
}
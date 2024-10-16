package co.oleh.realperfect.auth;

import co.oleh.realperfect.mapping.UserDto;
import co.oleh.realperfect.mapping.UserProfileDto;
import co.oleh.realperfect.mapping.UserSelfDto;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.user.Role;
import co.oleh.realperfect.repository.RealtorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import co.oleh.realperfect.model.user.AccountCredentials;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.repository.RoleRepository;
import co.oleh.realperfect.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {
    private MappingService mappingService;
    private UserRepository userRepository;
    private RealtorRepository realtorRepository;
    private RoleRepository roleRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserSelfDto patchProfile(Long id, UserProfileDto userDto) {
        User user = this.userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        mergePatch(userDto, user);

        User updatedUser = userRepository.save(user);

        UserSelfDto userSelfDto = this.mappingService.map(updatedUser, UserSelfDto.class);
        userSelfDto.setRoles(
                new TreeSet<>(user.getRoles()
                        .stream()
                        .map(Role::getName)
                        .collect(Collectors.toList()))
        );

        return userSelfDto;
    }

    public User save(User user) {
        if (this.userRepository.findByLogin(user.getLogin()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists!");
        }

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setRoles(
                new TreeSet<>(Collections.singletonList(roleRepository.findByName(Role.USER_ROLE)))
        );

        return userRepository.save(user);
    }

    public List<UserDto> findAll() {
        Iterable<User> iterable = userRepository.findAll();
        List<User> users = new ArrayList<>();
        iterable.forEach(users::add);

        return users.stream()
                .map(user -> {
                    UserDto userDto = mappingService.map(user, UserDto.class);
                    userDto.setRoles(user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()));
                    return userDto;
                })
                .collect(Collectors.toList());
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    public User findByGoogleUserIdTokenSubject(String googleUserId) {
        return userRepository.findByGoogleUserIdTokenSubject(googleUserId).orElse(null);
    }

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
            existingUser.setProfilePic(patchDto.getProfilePic());
        } else {
            existingUser.setProfilePic(null);
        }
    }

    public UserDto grantRealtorRole(String userId) {
        User user = this.userRepository.findById(Long.parseLong(userId)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        Role role = roleRepository.findByName(Role.REALTOR_ROLE);

        Set<Role> roles = user.getRoles();
        roles.add(role);
        this.userRepository.save(user);

        Realtor realtor = new Realtor();
        realtor.setUser(user);

        this.realtorRepository.save(realtor);

        return this.mappingService.map(user, UserDto.class);
    }

    @Transactional
    public UserDto removeRealtorRole(String userId) {
        User user = this.userRepository.findById(Long.parseLong(userId)).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        Role role = roleRepository.findByName(Role.REALTOR_ROLE);

        Realtor realtor = this.realtorRepository.findByUserId(user.getId());
        if (realtor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Realtor doesn't exist OR Realty objects");
        }
        if(!realtor.getRealtyObjects().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Realtor contains realty objects");
        }

        Set<Role> roles = user.getRoles();
        roles.remove(role);
        this.realtorRepository.deleteById(realtor.getId());
        this.userRepository.save(user);

        return this.mappingService.map(user, UserDto.class);
    }
}
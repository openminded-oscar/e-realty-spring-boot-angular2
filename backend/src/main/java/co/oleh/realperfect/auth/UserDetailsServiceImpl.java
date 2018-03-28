package co.oleh.realperfect.auth;

import co.oleh.realperfect.model.User;
import co.oleh.realperfect.repository.UserRepository;
import co.oleh.realperfect.model.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        User user = getUserByUsername(login);

        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        for (Role role : user.getRoles()) {
            grantedAuthorities.add(new SimpleGrantedAuthority(role.getName()));
        }

        return new ExtendedSpringUser(user.getLogin(),
                user.getPassword(),
                grantedAuthorities,
                user.getId(),
                user.getName(),
                user.getSurname());

    }

    public User getUserByUsername(String login) {
        User user = userRepository.findByLogin(login);

        return user;
    }
}

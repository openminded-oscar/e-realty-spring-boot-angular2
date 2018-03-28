package co.oleh.realperfect.auth;

import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class ExtendedSpringUser extends User {
    private Long id;
    private final String name;
    private final String surname;


    public ExtendedSpringUser(String username,
                              String password,
                              Collection authorities,
                              Long id,
                              String name,
                              String surname) {
        super(username, password, authorities);
        this.id = id;
        this.name = name;
        this.surname = surname;
    }


    public String getName() {
        return name;
    }

    public String getSurname() {
        return surname;
    }

    public Long getId() {
        return id;
    }
}
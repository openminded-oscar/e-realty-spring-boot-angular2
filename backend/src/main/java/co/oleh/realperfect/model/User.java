package co.oleh.realperfect.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "tbl_user")
public class User {
    @Getter(onMethod = @__({@Id, @GeneratedValue(strategy = GenerationType.AUTO)}))
    @Setter
    private Long id;
    @Getter
    @Setter
    private String login;
    @Getter(onMethod = @__(@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)))
    @Setter
    private String password;
    @Getter(onMethod = @__(@Transient))
    @Setter
    private String passwordConfirm;
    @Getter
    @Setter
    private String name;
    @Getter
    @Setter
    private String surname;
    @Getter(onMethod = @__(@Column(name = "phone_number")))
    @Setter
    private String phoneNumber;
    @Getter
    @Setter
    private String email;
    @Getter(onMethod = @__(@Column(name = "profile_pic")))
    @Setter
    private String profilePic;

    @Getter(onMethod = @__({
            @ManyToMany,
            @JoinTable(name = "tbl_user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    }))
    @Setter
    private Set<Role> roles;
}

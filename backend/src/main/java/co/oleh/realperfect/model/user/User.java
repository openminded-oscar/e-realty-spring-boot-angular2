package co.oleh.realperfect.model.user;

import co.oleh.realperfect.model.Realter;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "tbl_user")
public class User {
    private Long id;
    private String login;
    private String password;
    private String passwordConfirm;
    private Set<Role> roles;
    private String googleUserIdToken;
    private String name;
    private String surname;
    private String phoneNumber;
    private String email;
    private String profilePic;
    private Realter realterDetails;


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Lob
    @Column(length = 2000)
    public String getGoogleUserIdToken() {
        return googleUserIdToken;
    }

    public void setGoogleUserIdToken(String googleUserId) {
        this.googleUserIdToken = googleUserId;
    }

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "realter_id", referencedColumnName = "id")
    public Realter getRealterDetails() {
        return realterDetails;
    }

    public void setRealterDetails(Realter realterDetails) {
        this.realterDetails = realterDetails;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getSurname() {
        return surname;
    }
    public void setSurname(String surname) {
        this.surname = surname;
    }

    @Transient
    public String getPasswordConfirm() {
        return passwordConfirm;
    }

    public void setPasswordConfirm(String passwordConfirm) {
        this.passwordConfirm = passwordConfirm;
    }

    @ManyToMany
    @JoinTable(name = "tbl_user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    @Column(name = "phone_number")
    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Column(name = "profile_pic")
    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
}

package co.oleh.realperfect.model.user;

import co.oleh.realperfect.model.AuditableEntity;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.photos.UserPhoto;

import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "tbl_user")
public class User extends AuditableEntity {
    private Long id;
    private String login;
    private String email;
    private String password;
    private String passwordConfirm;
    private Set<Role> roles;
    private String googleUserIdTokenSubject;
    private String name;
    private String surname;
    private String phoneNumber;

    private UserPhoto profilePic;

    private List<RealtyObject> realtyObjects;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "owner")
    public List<RealtyObject> getRealtyObjects() {
        return realtyObjects;
    }

    public void setRealtyObjects(List<RealtyObject> realtyObjects) {
        this.realtyObjects = realtyObjects;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGoogleUserIdTokenSubject() {
        return googleUserIdTokenSubject;
    }

    public void setGoogleUserIdTokenSubject(String googleUserId) {
        this.googleUserIdTokenSubject = googleUserId;
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

    @ManyToMany(fetch = FetchType.EAGER)
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

    @Column(name = "email", unique = true, nullable = false)
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @OneToOne(cascade = CascadeType.MERGE, orphanRemoval = true)
    @JoinColumn(name = "photo_id")
    public UserPhoto getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(UserPhoto profilePic) {
        this.profilePic = profilePic;
    }
}

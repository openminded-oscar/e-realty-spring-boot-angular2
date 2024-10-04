package co.oleh.realperfect.model.user;

import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;

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
    private String googleUserIdTokenSubject;
    private String name;
    private String surname;
    private String phoneNumber;
    private String email;
    private String profilePic;
    private Realtor realtorDetails;
	private Set<RealtyObject> realtyObjects;

 	@OneToMany(fetch = FetchType.LAZY, mappedBy = "owner")
	public Set<RealtyObject> getRealtyObjects() {
		return realtyObjects;
	}
	public void setRealtyObjects(Set<RealtyObject> realtyObjects) {
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

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "realtor_id", referencedColumnName = "id")
    public Realtor getRealtorDetails() {
        return realtorDetails;
    }

    public void setRealtorDetails(Realtor realtorDetails) {
        this.realtorDetails = realtorDetails;
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

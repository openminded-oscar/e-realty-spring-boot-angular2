package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.user.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.userConfirmed = true WHERE u.id = :id")
    void setUserConfirmedById(@Param("id")Long id);

    @Modifying
    @Query("UPDATE User u SET u.password = :password WHERE u.id = :id")
    void setPasswordById(@Param("id")Long id, @Param("password") String password);
    Optional<User> findByEmail(String email);
    Optional<User> findByLogin(String login);
    Optional<User> findByGoogleUserIdTokenSubject(String googleUserIdToken);
}

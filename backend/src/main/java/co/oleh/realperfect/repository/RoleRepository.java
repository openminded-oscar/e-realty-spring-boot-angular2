package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.user.Role;
import co.oleh.realperfect.model.user.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    public Role findByName(RoleName name);
}

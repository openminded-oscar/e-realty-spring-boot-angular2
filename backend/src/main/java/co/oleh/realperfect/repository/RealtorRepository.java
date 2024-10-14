package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.Realtor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RealtorRepository extends JpaRepository<Realtor, Long> {
    List<Realtor> findByNameStartingWith(String nameStart);
    Realtor findByUserId(Long id);
}

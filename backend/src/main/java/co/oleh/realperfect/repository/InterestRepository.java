package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.Interest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterestRepository extends JpaRepository<Interest, Long> {
    List<Interest> findByUserId(Long userId);
    Interest findByUserIdAndRealtyObjId(Long userId, Long realtyObjId);
}

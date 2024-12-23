package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.Interest;
import co.oleh.realperfect.model.RealtyObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface InterestRepository extends JpaRepository<Interest, Long> {
    List<Interest> findByUserId(Long userId);
    Interest findByUserIdAndRealtyObjId(Long userId, Long realtyObjId);
    List<Interest> findByUserIdAndRealtyObjIdIn(Long userId, Collection<Long> realtyObj);
}

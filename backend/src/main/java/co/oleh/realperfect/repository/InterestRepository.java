package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.Interest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Repository
public interface InterestRepository extends JpaRepository<Interest, Long> {
    @Query("SELECT i.realtyObj.id, COUNT(i) FROM Interest i WHERE i.realtyObj.id IN :realtyObjIds GROUP BY i.realtyObj.id")
    List<Object[]> countByRealtyObjIds(@Param("realtyObjIds") List<Long> realtyObjIds);
    List<Interest> findByUserId(Long userId);
    Interest findByUserIdAndRealtyObjId(Long userId, Long realtyObjId);
    List<Interest> findByUserIdAndRealtyObjIdIn(Long userId, Collection<Long> realtyObj);
}

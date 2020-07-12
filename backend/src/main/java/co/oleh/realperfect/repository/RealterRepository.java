package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.Realter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RealterRepository extends JpaRepository<Realter, Long> {
    //    static final String QUERY_BY_NAME_OR_SURNAME = "SELECT r FROM Realter r"
//            + (" WHERE r.user.name LIKE :nameOrSurnameQuery")
//            + (" OR r.user.surname LIKE :nameOrSurnameQuery")
//            + (" ORDER BY r.user.surname ASC");
//
//    @Query(value = QUERY_BY_NAME_OR_SURNAME)
//    Iterable<Realter> findByUserNameOrSurnameIgnoreCaseLike(@Param("nameOrSurnameQuery") String query);

//    List<Realter> findByUser_NameStartingWithOrUser_SurnameStartingWith(String nameStart,
//                                                                        String surnameStart);
    List<Realter> findByNameStartingWith(String nameStart);
}

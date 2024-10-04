package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.Realtor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RealtorRepository extends JpaRepository<Realtor, Long> {
    //    static final String QUERY_BY_NAME_OR_SURNAME = "SELECT r FROM Realtor r"
//            + (" WHERE r.user.name LIKE :nameOrSurnameQuery")
//            + (" OR r.user.surname LIKE :nameOrSurnameQuery")
//            + (" ORDER BY r.user.surname ASC");
//
//    @Query(value = QUERY_BY_NAME_OR_SURNAME)
//    Iterable<Realtor> findByUserNameOrSurnameIgnoreCaseLike(@Param("nameOrSurnameQuery") String query);

//    List<Realtor> findByUser_NameStartingWithOrUser_SurnameStartingWith(String nameStart,
//                                                                        String surnameStart);
    List<Realtor> findByNameStartingWith(String nameStart);
}

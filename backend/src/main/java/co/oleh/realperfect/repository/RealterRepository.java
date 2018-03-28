package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.Realter;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RealterRepository extends CrudRepository<Realter, Long> {
    //    static final String QUERY_BY_NAME_OR_SURNAME = "SELECT r FROM Realter r"
//            + (" WHERE r.user.name LIKE :nameOrSurnameQuery")
//            + (" OR r.user.surname LIKE :nameOrSurnameQuery")
//            + (" ORDER BY r.user.surname ASC");
//
//    @Query(value = QUERY_BY_NAME_OR_SURNAME)
//    Iterable<Realter> findByUserNameOrSurnameIgnoreCaseLike(@Param("nameOrSurnameQuery") String query);

    Iterable<Realter> findByUser_NameStartingWithOrUser_SurnameStartingWith(String nameStart,
                                                                            String surnameStart);
}

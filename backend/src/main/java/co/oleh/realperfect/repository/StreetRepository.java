package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.StreetInCity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StreetRepository extends CrudRepository<StreetInCity, Long>{
	Iterable<StreetInCity> findByNameIgnoreCaseLikeAndCity_IdOrderByNameAsc(String name, Long cityId);
}

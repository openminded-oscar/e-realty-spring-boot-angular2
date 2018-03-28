package co.oleh.realperfect.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import co.oleh.realperfect.model.City;

@Repository
public interface CityRepository extends CrudRepository<City, Long> {
	Iterable<City> findByNameIgnoreCaseLikeOrderByNameAsc(String name);
}

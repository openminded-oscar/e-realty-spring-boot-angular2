package co.oleh.realperfect.address;

import co.oleh.realperfect.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.oleh.realperfect.model.City;

@Service
public class CityService {
	@Autowired
	private CityRepository cityRepository;
	
	public City add(City city){
		return cityRepository.save(city);
	}

	public Iterable<City> getAll() {
		return cityRepository.findAll();
	}
	
	public Iterable<City> getByNameIgnoreCaseLike(String queryFromUi) {
		String likeClause = queryFromUi + "%";
		
		return cityRepository.findByNameIgnoreCaseLikeOrderByNameAsc(likeClause);
	}
}

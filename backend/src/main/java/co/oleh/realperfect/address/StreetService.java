package co.oleh.realperfect.address;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.oleh.realperfect.model.StreetInCity;
import co.oleh.realperfect.repository.StreetRepository;

@Service
public class StreetService {
	@Autowired
	private StreetRepository streetRepository;

	public Iterable<StreetInCity> getStreetByNameAndCityId(String name, Long cityId) {
		String likeTemplate = name+"%";
		return streetRepository.findByNameIgnoreCaseLikeAndCity_IdOrderByNameAsc(likeTemplate, cityId);
	}
	
	
}

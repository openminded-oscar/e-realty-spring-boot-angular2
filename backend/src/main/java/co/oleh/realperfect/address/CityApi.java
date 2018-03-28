package co.oleh.realperfect.address;

import java.util.List;

import co.oleh.realperfect.model.City;
import co.oleh.realperfect.model.Region;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import co.oleh.realperfect.misc.services.MiscService;

@RestController
public class CityApi {
	@Autowired
	private CityService cityService;

	@Autowired
	private MiscService miscService;

	@RequestMapping(method = RequestMethod.POST, value = "/city/add")
	public ResponseEntity<City> addCity(@RequestBody City city) {
		City addedCity = cityService.add(city);

		return new ResponseEntity<>(addedCity, HttpStatus.OK);
	}

	@RequestMapping(method = RequestMethod.POST, value = "/city/find")
	public ResponseEntity<Iterable<City>> getByNameLike(@RequestBody CityFilter cityFilter) {
		String query = cityFilter.getQ();
		Iterable<City> cities = cityService.getByNameIgnoreCaseLike(query);

		return new ResponseEntity<>(cities, HttpStatus.OK);
	}
	
	@RequestMapping(method = RequestMethod.GET, value = "/regions")
	public ResponseEntity<List<Region>> getAllRegions() {
		List<Region> allRegions = miscService.getAllRegions();

		return new ResponseEntity<List<Region>>(allRegions, HttpStatus.OK);
	}

	public static class CityFilter {
		private String q;

		public String getQ() {
			return q;
		}

		public void setQ(String q) {
			this.q = q;
		}
	}
}

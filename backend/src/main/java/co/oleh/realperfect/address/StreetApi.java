package co.oleh.realperfect.address;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import co.oleh.realperfect.model.StreetInCity;

@RestController
public class StreetApi {
	private Logger logger = Logger.getLogger(StreetApi.class);
	
	@Autowired
	private StreetService streetService;
	
	@RequestMapping(method = RequestMethod.POST, value = "/street/find")
	public ResponseEntity<Iterable<StreetInCity>> getAll(@RequestBody StreetFilter streetFilter) {
		logger.info(streetFilter);
		Iterable<StreetInCity> streets = streetService.getStreetByNameAndCityId(streetFilter.getQ(),streetFilter.getCityId());

		return new ResponseEntity<>(streets, HttpStatus.OK);
	}
	
	public static class StreetFilter{
		private String q;
		private Long cityId;
		
		public Long getCityId() {
			return cityId;
		}

		public void setCityId(Long cityId) {
			this.cityId = cityId;
		}

		public String getQ() {
			return q;
		}

		public void setQ(String q) {
			this.q = q;
		}

		@Override
		public String toString() {
			return "StreetFilter [q=" + q + ", cityId=" + cityId + "]";
		}
	}
}

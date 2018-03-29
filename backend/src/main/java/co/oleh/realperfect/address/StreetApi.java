package co.oleh.realperfect.address;

import co.oleh.realperfect.model.StreetInCity;
import com.google.maps.GeoApiContext;
import com.google.maps.PlaceAutocompleteRequest;
import com.google.maps.PlacesApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.AutocompletePrediction;
import com.google.maps.model.LatLng;
import com.google.maps.model.PlaceAutocompleteType;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;

@RestController
public class StreetApi {
    private Logger logger = Logger.getLogger(StreetApi.class);

    @Autowired
    private StreetService streetService;

    @RequestMapping(method = RequestMethod.GET, value = "/api/addresses-nearby")
    public ResponseEntity<Iterable<AutocompletePrediction>> getGooglePlaces(@RequestParam String term, @RequestParam Double lat, @RequestParam Double lng)
            throws InterruptedException, ApiException, IOException {
        GeoApiContext geoApiContext = new GeoApiContext.Builder().apiKey("").build();
        PlaceAutocompleteRequest request = PlacesApi.placeAutocomplete(geoApiContext, term)
                .types(PlaceAutocompleteType.GEOCODE)
                .radius(150000)
                .location(new LatLng(lat, lng))
                .language("uk");

        AutocompletePrediction[] autocompletePredictions = request.await();
        return new ResponseEntity<>(Arrays.asList(autocompletePredictions), HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/street/find")
    public ResponseEntity<Iterable<StreetInCity>> getAll(@RequestBody StreetFilter streetFilter) throws InterruptedException, ApiException, IOException {
        Iterable<StreetInCity> streets = streetService.getStreetByNameAndCityId(streetFilter.getQ(), streetFilter.getCityId());

        return new ResponseEntity<>(streets, HttpStatus.OK);
    }

    public static class StreetFilter {
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

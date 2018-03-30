package co.oleh.realperfect.address;

import co.oleh.realperfect.model.CityOnMap;
import com.google.maps.errors.ApiException;
import com.google.maps.model.AutocompletePrediction;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/api/addresses")
@CrossOrigin(origins = "http://localhost:4200")
public class AddressApi {
    @Autowired
    private AddressService addressService;

    private Logger logger = Logger.getLogger(AddressApi.class);

    @RequestMapping(method = RequestMethod.GET, value = "/cities-supported")
    public ResponseEntity<Iterable<CityOnMap>> getCities() {
        return new ResponseEntity<>(addressService.getSupportedCities(), HttpStatus.OK);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/addresses-nearby")
    public ResponseEntity<Iterable<AutocompletePrediction>> getAddressesNearby(@RequestParam String term,
                                                                               @RequestParam Double lat,
                                                                               @RequestParam Double lng) throws InterruptedException, ApiException, IOException {
        List<AutocompletePrediction> autocompletePredictions = addressService.getAddressesNearby(term, lat, lng);

        return new ResponseEntity<>(autocompletePredictions, HttpStatus.OK);
    }
}
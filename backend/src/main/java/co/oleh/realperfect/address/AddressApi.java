package co.oleh.realperfect.address;

import co.oleh.realperfect.model.CityOnMap;
import com.google.maps.errors.ApiException;
import com.google.maps.model.AutocompletePrediction;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping(value = "/api/addresses")
@AllArgsConstructor
public class AddressApi {
    private AddressService addressService;

    private static final Logger LOGGER = LoggerFactory.getLogger(AddressApi.class);

    @GetMapping("/cities-supported")
    public ResponseEntity<Iterable<CityOnMap>> getCities() {
        return new ResponseEntity<>(addressService.getSupportedCities(), HttpStatus.OK);
    }

    @GetMapping("/addresses-nearby")
    public ResponseEntity<Iterable<AutocompletePrediction>> getAddressesNearby(@RequestParam String term,
                                                                               @RequestParam Double lat,
                                                                               @RequestParam Double lng) throws InterruptedException, ApiException, IOException {
        List<AutocompletePrediction> autocompletePredictions = addressService.getAddressesNearby(term, lat, lng);

        return new ResponseEntity<>(autocompletePredictions, HttpStatus.OK);
    }
}
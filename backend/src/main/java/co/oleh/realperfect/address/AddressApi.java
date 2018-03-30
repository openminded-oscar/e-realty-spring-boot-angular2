package co.oleh.realperfect.address;

import co.oleh.realperfect.model.CityOnMap;
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
@RequestMapping(value = "/api/addresses")
@CrossOrigin(origins = "http://localhost:4200")
public class AddressApi {
    @Autowired
    private GeoApiContext geoApiContext;
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
                                                                               @RequestParam Double lng)
            throws InterruptedException, ApiException, IOException {
        PlaceAutocompleteRequest request = PlacesApi.placeAutocomplete(geoApiContext, term)
                .types(PlaceAutocompleteType.GEOCODE)
                .radius(150000)
                .location(new LatLng(lat, lng))
                .language("uk");

        AutocompletePrediction[] autocompletePredictions = request.await();
        return new ResponseEntity<>(Arrays.asList(autocompletePredictions), HttpStatus.OK);
    }
}
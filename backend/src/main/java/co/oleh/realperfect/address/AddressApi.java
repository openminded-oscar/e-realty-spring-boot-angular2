package co.oleh.realperfect.address;

import co.oleh.realperfect.model.AddressByGeocodingDto;
import co.oleh.realperfect.model.Location;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;

@RestController
@RequestMapping(value = "/api/addresses")
@AllArgsConstructor
public class AddressApi {
    private AddressService addressService;

    private static final Logger LOGGER = LoggerFactory.getLogger(AddressApi.class);

    @GetMapping("/cities-supported")
    public ResponseEntity<Iterable<Location>> getCities() {
        return new ResponseEntity<>(addressService.getSupportedCities(), HttpStatus.OK);
    }

    @GetMapping("/address-by-geocoding")
    @RolesAllowed({"USER", "REALTOR", "ADMIN"})
    public ResponseEntity<AddressByGeocodingDto> getAddressesNearby(@RequestParam Double lat,
                                                                    @RequestParam Double lng,
                                                                    @RequestParam(required = false)
                                                                    String term) {
        AddressByGeocodingDto autocompletePredictions = addressService.getAddressByLngAndLat(lng, lat, term);

        return new ResponseEntity<>(autocompletePredictions, HttpStatus.OK);
    }
}
package co.oleh.realperfect.address;

import co.oleh.realperfect.model.AddressByGeocodingDto;
import co.oleh.realperfect.model.GeoSegment;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.security.RolesAllowed;

import java.util.List;

import static co.oleh.realperfect.model.user.RoleUtils.*;

@RestController
@RequestMapping(value = "/api/addresses")
@AllArgsConstructor
public class AddressApi {
    private AddressService addressService;

    private static final Logger LOGGER = LoggerFactory.getLogger(AddressApi.class);

    @GetMapping("/regions-supported")
    public ResponseEntity<List<GeoSegment>> getCities() {
        return new ResponseEntity<>(addressService.supportedCities(), HttpStatus.OK);
    }

    @GetMapping("/address-by-geocoding")
    @RolesAllowed({USER_ROLE, REALTOR_ROLE, ADMIN_ROLE})
    public ResponseEntity<AddressByGeocodingDto> getAddressesNearby(@RequestParam Double lat,
                                                                    @RequestParam Double lng,
                                                                    @RequestParam(required = false)
                                                                    String term) {
        AddressByGeocodingDto autocompletePredictions = addressService.getAddressByLngAndLat(lng, lat, term);

        return new ResponseEntity<>(autocompletePredictions, HttpStatus.OK);
    }
}
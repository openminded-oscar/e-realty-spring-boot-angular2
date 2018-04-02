package co.oleh.realperfect.address;

import co.oleh.realperfect.model.CityOnMap;
import com.google.maps.GeoApiContext;
import com.google.maps.PlaceAutocompleteRequest;
import com.google.maps.PlacesApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.AutocompletePrediction;
import com.google.maps.model.LatLng;
import com.google.maps.model.PlaceAutocompleteType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class AddressService {
    @Autowired
    private GeoApiContext geoApiContext;

    private static final List<CityOnMap> SUPPORTED_CITIES;
    static {
        SUPPORTED_CITIES = Arrays.asList(
                new CityOnMap("Львів", 49.8430008,24.0215309),
                new CityOnMap("Київ", 50.4431254,30.5267917),
                new CityOnMap("Івано-Франківськ", 48.9119062,24.701189),
                new CityOnMap("Черкаси", 49.4260047,32.0495275));
    }

    public List<CityOnMap> getSupportedCities() {
        return AddressService.SUPPORTED_CITIES;
    }

    public List<AutocompletePrediction> getAddressesNearby(String term, Double lat, Double lng)
            throws InterruptedException, ApiException, IOException {
        if(term.trim().equals("")){
            return new ArrayList<>();
        }

        PlaceAutocompleteRequest request = PlacesApi.placeAutocomplete(geoApiContext, term)
                .types(PlaceAutocompleteType.GEOCODE)
                .radius(150000)
                .location(new LatLng(lat, lng))
                .language("uk");

        AutocompletePrediction[] autocompletePredictions = request.await();
        return Arrays.asList(autocompletePredictions);
    }
}

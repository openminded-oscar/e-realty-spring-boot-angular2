package co.oleh.realperfect.address;

import co.oleh.realperfect.model.CityOnMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import co.oleh.realperfect.model.StreetInCity;
import co.oleh.realperfect.repository.StreetRepository;

import java.util.Arrays;
import java.util.List;

@Service
public class AddressService {
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
}

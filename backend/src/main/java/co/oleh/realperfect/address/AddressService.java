package co.oleh.realperfect.address;

import co.oleh.realperfect.model.AddressByGeocodingDto;
import co.oleh.realperfect.model.GeoLocationUtils;
import co.oleh.realperfect.model.GeoSegment;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AddressService {
    @Value("${google.geocodingapikey}")
    private String geocodingapikey;
    private final RestTemplate restTemplate;

    public AddressService() {
        restTemplate = new RestTemplate();
        ObjectMapper objectMapper = new ObjectMapper()
                .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE)
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        restTemplate.getMessageConverters().add(new MappingJackson2HttpMessageConverter(objectMapper));
    }


    public List<GeoSegment> supportedCities() {
        return GeoLocationUtils.generateRegionalCentersForUkraine();
    }

    public AddressByGeocodingDto getAddressByLngAndLat(Double lng, Double lat, String term) {
        String url = String.format(
                "https://maps.googleapis.com/maps/api/geocode/json?latlng=%s,%s&key=%s",
                lat, lng, this.geocodingapikey);
        GeoCodeResponse geoCodeResponse =
                this.restTemplate.getForEntity(url, GeoCodeResponse.class).getBody();

        if (geoCodeResponse != null) {
            AddressByGeocodingDto addressByGeocodingDto = this.mapResponseToAddress(geoCodeResponse);
            if (addressByGeocodingDto != null) {
                return addressByGeocodingDto;
            }
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    }

    private AddressByGeocodingDto mapResponseToAddress(GeoCodeResponse geoCodeResponse) {
        List<GeoCodeResponse.Result> results = geoCodeResponse.getResults();
        String city = null;
        String street = null;

        for (GeoCodeResponse.Result result : results) {
            String currentCity = null;
            String currentStreet = null;

            for (GeoCodeResponse.AddressComponent addressComponent : result.getAddressComponents()) {
                if (addressComponent.getTypes().contains("locality")) {
                    currentCity = addressComponent.getLongName();
                } else if (addressComponent.getTypes().contains("route")) {
                    currentStreet = addressComponent.getLongName();
                }
            }

            if (currentCity != null && currentStreet != null) {
                city = currentCity;
                street = currentStreet;
            }
        }

        if (city != null && street != null) {
            AddressByGeocodingDto address = new AddressByGeocodingDto();
            address.setCity(city);
            address.setStreet(street);
            return address;
        }

        return null;
    }

}

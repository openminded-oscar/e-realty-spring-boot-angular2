package co.oleh.realperfect.realtor;


import co.oleh.realperfect.mapping.RealtorDto;
import co.oleh.realperfect.model.Realtor;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/realtor")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class RealtorApi {
    private static final Logger LOGGER = LoggerFactory.
            getLogger(RealtorApi.class);

    private RealtorService realtorService;

    @GetMapping
    public ResponseEntity<List<RealtorDto>> findRealtor(@RequestParam(required = false) String query) {
        List<RealtorDto> realtors = (query == null) ? realtorService.findAll() : realtorService.findByNameOrSurnameLike(query);

        return new ResponseEntity<>(realtors, HttpStatus.OK);
    }

    @GetMapping(value = "/{objectId}")
    public ResponseEntity<Realtor> getRealtor(@PathVariable Long objectId) {
        Realtor realtyObject = realtorService.findById(objectId);
        return new ResponseEntity<>(realtyObject, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Realtor> saveRealtor(@RequestBody Realtor realtor) {
        return new ResponseEntity<>(realtorService.save(realtor), HttpStatus.OK);
    }

    @PutMapping(value = "/{objectId}")
    public ResponseEntity<Realtor> updateRealtor(@RequestBody Realtor realtor, @PathVariable Long objectId) {
        return new ResponseEntity<>(realtorService.save(realtor), HttpStatus.OK);
    }
}

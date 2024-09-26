package co.oleh.realperfect.realter;


import co.oleh.realperfect.mapping.RealterDto;
import co.oleh.realperfect.model.Realter;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/realter")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class RealterApi {
    private static final Logger LOGGER = LoggerFactory.
            getLogger(RealterApi.class);

    private RealterService realterService;

    @GetMapping
    public ResponseEntity<List<RealterDto>> findRealter(@RequestParam(required = false) String query) {
        List<RealterDto> realters = (query == null) ? realterService.findAll() : realterService.findByNameOrSurnameLike(query);

        return new ResponseEntity<>(realters, HttpStatus.OK);
    }

    @GetMapping(value = "/{objectId}")
    public ResponseEntity<Realter> getRealter(@PathVariable Long objectId) {
        Realter realtyObject = realterService.findById(objectId);
        return new ResponseEntity<>(realtyObject, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Realter> saveRealter(@RequestBody Realter realter) {
        return new ResponseEntity<>(realterService.save(realter), HttpStatus.OK);
    }

    @PutMapping(value = "/{objectId}")
    public ResponseEntity<Realter> updateRealter(@RequestBody Realter realter, @PathVariable Long objectId) {
        return new ResponseEntity<>(realterService.save(realter), HttpStatus.OK);
    }
}

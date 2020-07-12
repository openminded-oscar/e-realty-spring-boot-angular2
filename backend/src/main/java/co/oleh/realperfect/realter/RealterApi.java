package co.oleh.realperfect.realter;


import co.oleh.realperfect.model.Realter;
import lombok.AllArgsConstructor;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/realter")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class RealterApi {
    private static final Logger LOGGER = Logger.
            getLogger(RealterApi.class);

    private RealterService realterService;

    @GetMapping(value = "/list")
    public ResponseEntity<List<Realter>> findRealter(@RequestParam(required = false) String query) {
        List<Realter> realters = (query == null) ? realterService.findAll() : realterService.findByNameOrSurnameLike(query);

        return new ResponseEntity<>(realters, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Realter> saveRealter(@RequestBody Realter realter) {
        return new ResponseEntity<>(realterService.save(realter), HttpStatus.OK);
    }
}

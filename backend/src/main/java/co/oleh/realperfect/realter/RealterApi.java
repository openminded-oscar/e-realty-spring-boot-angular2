package co.oleh.realperfect.realter;


import co.oleh.realperfect.model.Realter;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/realter")
@CrossOrigin(origins = "http://localhost:4200")
public class RealterApi {
    private static final Logger LOGGER = Logger.
            getLogger(RealterApi.class);

    @Autowired
    private RealterService realterService;

    @GetMapping(value = "/list")
    public ResponseEntity<List<Realter>> findRealter(@RequestParam(required = false) String query) {
        List<Realter> realters = (query == null) ? realterService.findAll() : realterService.findByNameOrSurnameLike(query);

        return new ResponseEntity<>(realters, HttpStatus.OK);
    }
}

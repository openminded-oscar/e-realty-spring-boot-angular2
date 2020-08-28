package co.oleh.realperfect.mapping;

import lombok.extern.slf4j.Slf4j;
import ma.glasnost.orika.MapperFacade;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class MappingService {
    final static Logger LOG = LoggerFactory.getLogger(MappingService.class);

    @Autowired
    private MapperFacade orikaMapper;


    /**
     * Manually completes library-based per-field entity-to-dto mapping.
     *
     * @param from - object to be converted
     * @param to   - destination class
     * @param <T>  - class of object to be converted
     * @param <V>  - destination class
     * @return
     */
    public <T, V> V map(T from, Class<V> to) {
        V result = orikaMapper.map(from, to);
//        if (result.getClass().equals() && from.getClass().equals()) {
//        }
//        else if (result.getClass().equals() && from.getClass().equals()) {
//        }

        return result;
    }

    /**
     * Manually completes library-based per-field entity-to-dto mapping.
     *
     * @param from - object to be converted
     * @param to   - destination class
     * @param <T>  - class of object to be converted
     * @param <V>  - destination class
     * @return
     */
    public <T, V> List<V> mapList(List<T> from, Class<V> to) {
        List<V> convertingResult = new ArrayList<>();

        for (T item : from) {
            convertingResult.add(map(item, to));
        }

        return convertingResult;
    }
}
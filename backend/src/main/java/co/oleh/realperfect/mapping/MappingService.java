package co.oleh.realperfect.mapping;

import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDetailsDto;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDto;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;
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
        if (result != null && result.getClass().equals(RealtorDto.class) && from.getClass().equals(Realtor.class)) {
            Realtor realtor = (Realtor) from;
            RealtorDto realtorDto = (RealtorDto) result;

            realtorDto.setName(realtor.getUser().getName());
            realtorDto.setSurname(realtor.getUser().getSurname());
            realtorDto.setProfilePic(realtor.getUser().getProfilePic());
        }

        if (result != null && result.getClass().equals(RealtyObjectDetailsDto.class)
                && from.getClass().equals(RealtyObject.class)) {
            RealtyObject object = (RealtyObject) from;
            RealtyObjectDetailsDto dto = (RealtyObjectDetailsDto) result;

            dto.setRealtor(this.map(object.getRealtor(), RealtorDto.class));
        }
        if (result != null && result.getClass().equals(RealtyObjectDto.class)
                && from.getClass().equals(RealtyObject.class)) {
            RealtyObject object = (RealtyObject) from;
            RealtyObjectDto dto = (RealtyObjectDto) result;

            dto.setRealtor(this.map(object.getRealtor(), RealtorDto.class));
        }
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
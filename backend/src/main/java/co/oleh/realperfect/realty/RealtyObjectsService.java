package co.oleh.realperfect.realty;

import co.oleh.realperfect.model.BuildingType;
import co.oleh.realperfect.model.OperationType;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.filtering.RealtyObjectsFilter;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.repository.RealtyObjectPhotoRepository;
import co.oleh.realperfect.repository.RealtyObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RealtyObjectsService {
    @Autowired
    private RealtyObjectRepository realtyObjectRepository;

    @Autowired
    private RealtyObjectPhotoRepository realtyObjectPhotoRepository;

    @SuppressWarnings("unchecked")
    public Iterable<RealtyObject> getAll(RealtyObjectsFilter objectsFilter) {
//        return realtyObjectRepository.findAll(new RealtyObjectSpecification(objectsFilter));
        return realtyObjectRepository.findAll();
    }

    public RealtyObject add(RealtyObject realtyObject) {
        List<RealtyObjectPhoto> retrievedPhotos = realtyObject.getPhotos()
                .stream()
                .map(photoToMap -> {
                    RealtyObjectPhoto photo = realtyObjectPhotoRepository.findOne(photoToMap.getId());
                    photo.setType(photoToMap.getType());
                    return photo;
                })
                .collect(Collectors.toList());
        realtyObject.setPhotos(retrievedPhotos);

        return realtyObjectRepository.save(realtyObject);
    }

    public RealtyObject getObjectById(Long objectId) {
        return realtyObjectRepository.findOne(objectId);
    }

    public Set<BuildingType> getRealtyBuildingTypes() {
        Set<BuildingType> buildingTypes = new HashSet<>();
        Collections.addAll(buildingTypes, BuildingType.values());

        return buildingTypes;
    }

    public Set<OperationType> getRealtyOperationTypes() {
        Set<OperationType> operationTypes = new HashSet<>();
        Collections.addAll(operationTypes, OperationType.values());

        return operationTypes;
    }
}

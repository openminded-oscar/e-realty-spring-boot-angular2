package co.oleh.realperfect.mapping.realtyobject;
import co.oleh.realperfect.mapping.RealterDto;
import co.oleh.realperfect.model.Address;
import co.oleh.realperfect.model.BuildingType;
import co.oleh.realperfect.model.DwellingType;
import co.oleh.realperfect.model.OperationType;
import co.oleh.realperfect.model.photos.ConfirmationDocPhoto;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.model.user.User;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
public class RealtyObjectDetailsDto {
        Long id;
        Integer roomsAmount;
        Integer floor;
        Integer totalFloors;
        BigDecimal price;
        BigDecimal totalArea;
        BigDecimal livingArea;
        String description;
        Boolean hasGarage;
        Boolean hasRepairing;
        Boolean hasCellar;
        Boolean hasLoft;
        Integer foundationYear;
        String otherInfo;
        BuildingType buildingType;
        DwellingType dwellingType;
        Set<OperationType> targetOperations;
        Boolean confirmed;
        Boolean realterAware;
        Address address;
        User owner;
        RealterDto realter;
        List<RealtyObjectPhoto> photos;
        ConfirmationDocPhoto confirmationDocPhoto;
}

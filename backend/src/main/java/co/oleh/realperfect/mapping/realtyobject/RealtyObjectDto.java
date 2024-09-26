package co.oleh.realperfect.mapping.realtyobject;

import co.oleh.realperfect.mapping.RealterDto;
import co.oleh.realperfect.model.*;
import co.oleh.realperfect.model.photos.ConfirmationDocPhoto;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
public class RealtyObjectDto {
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
    RealterDto realter;
    List<RealtyObjectPhoto> photos;
    ConfirmationDocPhoto confirmationDocPhoto;
}

package co.oleh.realperfect.mapping.realtyobject;

import co.oleh.realperfect.mapping.RealtorDto;
import co.oleh.realperfect.model.*;
import co.oleh.realperfect.model.photos.ConfirmationDocPhoto;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Set;

@Data
public class RealtyObjectDto {
    Long id;
    Integer roomsAmount;
    Integer floor;
    Integer totalFloors;
    BigDecimal price;
    BigDecimal priceForRent;
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
    Boolean realtorAware;
    Address address;
    RealtorDto realtor;
    List<RealtyObjectPhoto> photos;
    ConfirmationDocPhoto confirmationDocPhoto;
    Instant createdAt;
}

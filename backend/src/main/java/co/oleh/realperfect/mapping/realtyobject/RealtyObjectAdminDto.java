package co.oleh.realperfect.mapping.realtyobject;

import co.oleh.realperfect.mapping.AddressDto;
import co.oleh.realperfect.mapping.RealtorDto;
import co.oleh.realperfect.model.BuildingType;
import co.oleh.realperfect.model.DwellingType;
import co.oleh.realperfect.model.OperationType;
import co.oleh.realperfect.model.RealtyObjectStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Set;

@Data
public class RealtyObjectAdminDto {
    Long id;
    Integer roomsAmount;
    BigDecimal price;
    BigDecimal priceForRent;
    BigDecimal totalArea;
    BigDecimal livingArea;
    String description;
    BuildingType buildingType;
    DwellingType dwellingType;
    RealtyObjectStatus status;
    Set<OperationType> targetOperations;
    AddressDto address;
    RealtorDto realtor;
    Instant createdAt;
}

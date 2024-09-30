package co.oleh.realperfect.mapping.realtyobject;
import co.oleh.realperfect.mapping.RealterDto;
import co.oleh.realperfect.mapping.UserDto;
import co.oleh.realperfect.mapping.UserSelfDto;
import co.oleh.realperfect.model.Address;
import co.oleh.realperfect.model.BuildingType;
import co.oleh.realperfect.model.DwellingType;
import co.oleh.realperfect.model.OperationType;
import co.oleh.realperfect.model.photos.ConfirmationDocPhoto;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import lombok.Data;

import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Data
public class RealtyObjectDetailsDto {
        Long id;
        @NotNull(message = "Rooms amount is required")
        @Min(value = 1, message = "Rooms amount must be at least 1")
        Integer roomsAmount;
        Integer floor;
        Integer totalFloors;
        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
        BigDecimal price;
        @NotNull(message = "Total area is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Total area must be greater than 0")
        BigDecimal totalArea;
        BigDecimal livingArea;
        String description;
        Boolean hasGarage;
        Boolean hasRepairing;
        Boolean hasCellar;
        Boolean hasLoft;
        @Min(value = 1600, message = "Foundation year must be after 1600")
        Integer foundationYear;
        String otherInfo;
        BuildingType buildingType;
        DwellingType dwellingType;
        @NotNull(message = "Target operations are required")
        Set<OperationType> targetOperations;
        Boolean confirmed;
        Boolean realterAware;
        Address address;
        UserDto owner;
        RealterDto realter;
        List<RealtyObjectPhoto> photos;
        ConfirmationDocPhoto confirmationDocPhoto;
}

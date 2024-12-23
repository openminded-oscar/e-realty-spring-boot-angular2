package co.oleh.realperfect.mapping.realtyobject;
import co.oleh.realperfect.mapping.AddressDto;
import co.oleh.realperfect.mapping.PhotoDto;
import co.oleh.realperfect.mapping.RealtorDto;
import co.oleh.realperfect.mapping.UserDto;
import co.oleh.realperfect.model.*;
import co.oleh.realperfect.model.photos.ConfirmationDocPhoto;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import lombok.Data;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Set;

@Data
public class RealtyObjectDetailsDto {
        Long id;
        String status;

        @NotNull(message = "Rooms amount is required")
        @Min(value = 1, message = "Rooms amount must be at least 1")
        Integer roomsAmount;
        Integer floor;

        Integer totalFloors;
        @DecimalMin(value = "0.0", inclusive = false, message = "Selling price must be greater than 0")
        BigDecimal price;
        @DecimalMin(value = "0.0", inclusive = false, message = "Rent price must be greater than 0")
        BigDecimal priceForRent;
        @NotNull(message = "Total area is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Total area must be greater than 0")
        BigDecimal totalArea;
        BigDecimal livingArea;
        @Size(max = 255, message = "The string must not exceed 300 characters.")
        String description;
        Boolean hasGarage;
        Boolean hasRepairing;
        Boolean hasCellar;
        Boolean hasLoft;
        @Min(value = 0, message = "Foundation year must be after 0")
        Integer foundationYear;
        String otherInfo;
        BuildingType buildingType;
        DwellingType dwellingType;
        @NotNull(message = "Target operations are required")
        Set<OperationType> targetOperations;
        @Valid
        AddressDto address;
        UserDto owner;
        RealtorDto realtor;
        List<RealtyObjectPhoto> photos;
        PhotoDto confirmationDocPhoto;
        Instant createdAt;
        Instant updatedAt;
}

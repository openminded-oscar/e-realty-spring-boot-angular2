package co.oleh.realperfect.model;

import co.oleh.realperfect.model.photos.ConfirmationDocPhoto;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.model.user.User;
import lombok.ToString;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Entity
@Table(indexes = {
        @Index(name = "idx_city", columnList = "city"),
        @Index(name = "idx_owner_id", columnList = "owner_id"),
        @Index(name = "idx_realtor_id", columnList = "realtor_id")
}, name = "tbl_realty_object")
@ToString
public class RealtyObject extends AuditableEntity {
    private Long id;
    private RealtyObjectStatus status = RealtyObjectStatus.ACTIVE;
    private BigDecimal price;
    private BigDecimal priceForRent;

    private Integer roomsAmount;
    private Integer floor;
    private Integer totalFloors;
    private BigDecimal totalArea;
    private BigDecimal livingArea;
    private String description;
    private Boolean hasGarage;
    private Boolean hasRepairing;
    private Boolean hasCellar;
    private Boolean hasLoft;
    private Integer foundationYear;
    private String otherInfo;
    private BuildingType buildingType;
    private DwellingType dwellingType;
    private Set<OperationType> targetOperations;
    private Boolean confirmed = false;
    private Address address;
    private User owner;
    private Realtor realtor;

    private List<RealtyObjectPhoto> photos;
    private ConfirmationDocPhoto confirmationDocPhoto;
    private List<Interest> interests;

    @OneToMany(mappedBy = "realtyObj", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    public List<Interest> getInterests() {
        return interests;
    }

    public void setInterests(List<Interest> interests) {
        this.interests = interests;
    }

    private List<ObjectReview> objectReviews;

    @OneToMany(mappedBy = "realtyObj", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    public List<ObjectReview> getObjectReviews() {
        return objectReviews;
    }

    public void setObjectReviews(List<ObjectReview> objectReviews) {
        this.objectReviews = objectReviews;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "rooms_amount")
    public Integer getRoomsAmount() {
        return roomsAmount;
    }

    public void setRoomsAmount(Integer roomsAmount) {
        this.roomsAmount = roomsAmount;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    @Column(name = "total_floors")
    public Integer getTotalFloors() {
        return totalFloors;
    }

    public void setTotalFloors(Integer totalFloors) {
        this.totalFloors = totalFloors;
    }

    @Column(name = "price")
    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    @Column(name = "price_for_rent")
    public BigDecimal getPriceForRent() {
        return priceForRent;
    }

    public void setPriceForRent(BigDecimal priceForRent) {
        this.priceForRent = priceForRent;
    }

    @Column(name = "total_area")
    public BigDecimal getTotalArea() {
        return totalArea;
    }

    public void setTotalArea(BigDecimal totalArea) {
        this.totalArea = totalArea;
    }

    @Column(name = "living_area")
    public BigDecimal getLivingArea() {
        return livingArea;
    }

    public void setLivingArea(BigDecimal livingArea) {
        this.livingArea = livingArea;
    }

    @Column(name = "has_garage")
    public Boolean getHasGarage() {
        return hasGarage;
    }

    public void setHasGarage(Boolean hasGarage) {
        this.hasGarage = hasGarage;
    }

    @Column(name = "has_repairing")
    public Boolean getHasRepairing() {
        return hasRepairing;
    }

    public void setHasRepairing(Boolean hasRepairing) {
        this.hasRepairing = hasRepairing;
    }

    @Column(name = "has_cellar")
    public Boolean getHasCellar() {
        return hasCellar;
    }

    public void setHasCellar(Boolean hasCellar) {
        this.hasCellar = hasCellar;
    }

    @Column(name = "has_loft")
    public Boolean getHasLoft() {
        return hasLoft;
    }

    public void setHasLoft(Boolean hasLoft) {
        this.hasLoft = hasLoft;
    }

    @Column(name = "foundation_year")
    public Integer getFoundationYear() {
        return foundationYear;
    }

    public void setFoundationYear(Integer foundationYear) {
        this.foundationYear = foundationYear;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Column(name = "other_info")
    public String getOtherInfo() {
        return otherInfo;
    }

    public void setOtherInfo(String otherInfo) {
        this.otherInfo = otherInfo;
    }

    @Column(name = "building_type")
    @Enumerated(EnumType.STRING)
    public BuildingType getBuildingType() {
        return buildingType;
    }

    public void setBuildingType(BuildingType buildingType) {
        this.buildingType = buildingType;
    }

    @Column(name = "dwelling_type")
    @Enumerated(EnumType.STRING)
    public DwellingType getDwellingType() {
        return dwellingType;
    }

    public void setDwellingType(DwellingType dwellingType) {
        this.dwellingType = dwellingType;
    }

    @ElementCollection(targetClass = OperationType.class)
    @CollectionTable(name = "tbl_object_supported_operations",
            joinColumns = @JoinColumn(name = "object_id"))
    @Column(name = "operation_type", nullable = false)
    @Enumerated(EnumType.STRING)
    public Set<OperationType> getTargetOperations() {
        return targetOperations;
    }

    public void setTargetOperations(Set<OperationType> targetOperations) {
        this.targetOperations = targetOperations;
    }

    @Embedded
    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    @ManyToOne(optional = true)
    @JoinColumn(name = "owner_id", nullable = true)
    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Boolean getConfirmed() {
        return confirmed;
    }

    public void setConfirmed(Boolean confirmed) {
        this.confirmed = confirmed;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "realtor_id")
    public Realtor getRealtor() {
        return realtor;
    }

    public void setRealtor(Realtor realtor) {
        this.realtor = realtor;
    }


    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "realty_object_id")
    public ConfirmationDocPhoto getConfirmationDocPhoto() {
        return confirmationDocPhoto;
    }

    public void setConfirmationDocPhoto(ConfirmationDocPhoto confirmationDocPhoto) {
        this.confirmationDocPhoto = confirmationDocPhoto;
    }

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "realty_object_id")
    public List<RealtyObjectPhoto> getPhotos() {
        return photos;
    }

    public void setPhotos(List<RealtyObjectPhoto> photos) {
        this.photos = photos;
    }

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    public RealtyObjectStatus getStatus() {
        return status;
    }

    public void setStatus(RealtyObjectStatus status) {
        this.status = status;
    }
}
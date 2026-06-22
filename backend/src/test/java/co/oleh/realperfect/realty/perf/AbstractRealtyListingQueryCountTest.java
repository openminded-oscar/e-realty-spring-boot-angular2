package co.oleh.realperfect.realty.perf;

import co.oleh.realperfect.mapping.mappers.AddressDtoToAddressMapper;
import co.oleh.realperfect.mapping.mappers.AddressToAddressDtoMapper;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.mapping.mappers.ModelMapperConfiguration;
import co.oleh.realperfect.mapping.mappers.RoleToStringDtoMapper;
import co.oleh.realperfect.mapping.mappers.UserToRealtyOwnerDtoMapper;
import co.oleh.realperfect.mapping.realtyobject.RealtyObjectDtoLikable;
import co.oleh.realperfect.model.Address;
import co.oleh.realperfect.model.GeoLocationUtils;
import co.oleh.realperfect.model.OperationType;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.RealtyObjectStatus;
import co.oleh.realperfect.model.RealtyPhotoType;
import co.oleh.realperfect.model.Region;
import co.oleh.realperfect.model.photos.ConfirmationDocPhoto;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.realty.filtering.FilterItem;
import co.oleh.realperfect.realty.filtering.RealtyObjectSpecification;
import co.oleh.realperfect.repository.RealtyObjectFilterRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceUnit;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Base for the realty-listing N+1 perf test.
 *
 * <p>Seeds {@link #OBJECT_COUNT} ACTIVE realty objects, each carrying the associations that the
 * listing DTO mapping touches (photos, targetOperations, confirmationDocPhoto, realtor + its user),
 * then measures how many JDBC statements one paginated listing-and-map cycle costs via Hibernate
 * {@link Statistics}. Query count — not wall-clock — is the deterministic signal for N+1.
 *
 * <p>Subclasses differ only by whether {@code hibernate.default_batch_fetch_size} is set, giving a
 * clean before/after comparison. Runs against a dedicated schema on the dev MySQL; self-skips when
 * that DB is not reachable so a normal build without a DB stays green.
 */
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("perftest")
@Import({PerfTestConfig.class, ModelMapperConfiguration.class, MappingService.class,
        AddressDtoToAddressMapper.class, AddressToAddressDtoMapper.class,
        RoleToStringDtoMapper.class, UserToRealtyOwnerDtoMapper.class})
abstract class AbstractRealtyListingQueryCountTest {
    protected static final int OBJECT_COUNT = 30;
    protected static final int PAGE_SIZE = 20;
    protected static final int PHOTOS_PER_OBJECT = 3;

    @PersistenceContext
    private EntityManager em;
    @PersistenceUnit
    private EntityManagerFactory emf;
    @Autowired
    private RealtyObjectFilterRepository filterRepository;
    @Autowired
    private MappingService mappingService;

    @BeforeEach
    void seed() {
        Assumptions.assumeTrue(devMySqlReachable(),
                "dev MySQL on localhost:3307 not reachable — skipping listing perf test");

        for (int i = 0; i < OBJECT_COUNT; i++) {
            em.persist(buildObject(i));
        }
        em.flush();
        em.clear();
    }

    /**
     * Runs one paginated listing + DTO mapping (mirroring
     * {@code RealtyObjectsService.getAllActiveObjectsForFilterItems}) and returns the number of
     * JDBC statements Hibernate prepared for it.
     */
    protected long measureListingStatements() {
        Statistics stats = emf.unwrap(SessionFactory.class).getStatistics();
        stats.clear();

        Specification<RealtyObject> spec = new RealtyObjectSpecification(FilterItem.ofStatusActive());
        Page<RealtyObject> page = filterRepository.findAll(spec, PageRequest.of(0, PAGE_SIZE));
        page.getContent().forEach(o -> mappingService.map(o, RealtyObjectDtoLikable.class));

        long statements = stats.getPrepareStatementCount();
        em.clear();
        return statements;
    }

    private RealtyObject buildObject(int i) {
        User owner = persistUser("owner" + i);

        Realtor realtor = new Realtor();
        realtor.setUser(persistUser("realtor" + i));
        em.persist(realtor);

        RealtyObject o = new RealtyObject();
        o.setStatus(RealtyObjectStatus.ACTIVE);
        o.setRoomsAmount(3);
        o.setPrice(BigDecimal.valueOf(100_000));
        o.setTotalArea(BigDecimal.valueOf(75));
        o.setDescription("perf-seed-" + i);
        o.setTargetOperations(Set.of(OperationType.SELLING, OperationType.RENT));
        o.setOwner(owner);
        o.setRealtor(realtor);

        Address address = new Address();
        address.setCity("City" + i);
        address.setStreet("Street" + i);
        address.setRegion(new Region(1L, "Region", 50.45, 30.52));
        address.setGeolocation(GeoLocationUtils.lonLatToPoint(30.52, 50.45));
        o.setAddress(address);

        List<RealtyObjectPhoto> photos = new ArrayList<>();
        for (int p = 0; p < PHOTOS_PER_OBJECT; p++) {
            RealtyObjectPhoto photo = new RealtyObjectPhoto("obj" + i + "_photo" + p + ".jpg");
            photo.setType(p == 0 ? RealtyPhotoType.REALTY_MAIN : RealtyPhotoType.REALTY_PLAIN);
            photos.add(photo);
        }
        o.setPhotos(photos);
        o.setConfirmationDocPhoto(new ConfirmationDocPhoto("obj" + i + "_doc.jpg"));

        return o;
    }

    private User persistUser(String suffix) {
        User u = new User();
        u.setEmail("perf-" + suffix + "@test.dev");
        u.setLogin("perf-" + suffix);
        u.setName("Name-" + suffix);
        u.setSurname("Surname-" + suffix);
        u.setPhoneNumber("+380000000000");
        u.setUserConfirmed(true);
        em.persist(u);
        return u;
    }

    private static boolean devMySqlReachable() {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress("localhost", 3307), 500);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

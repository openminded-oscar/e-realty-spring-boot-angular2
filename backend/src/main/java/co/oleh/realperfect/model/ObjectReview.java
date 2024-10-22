package co.oleh.realperfect.model;

import co.oleh.realperfect.model.user.User;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(
        name = "tbl_object_review",
        indexes = {@Index(name = "idx_realtor", columnList = "realtor_id"),
                @Index(name = "idx_user", columnList = "user_id"),
                @Index(name = "idx_realtyObj", columnList = "realty_obj_id")},
        uniqueConstraints = {@UniqueConstraint(columnNames = {"realty_obj_id", "date_time"})}
)
public class ObjectReview extends AuditableEntity {
    private Long id;
    private User user;
    private Realtor realtor;
    private RealtyObject realtyObj;
    private Instant dateTime;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "realtor_id", nullable = true)
    public Realtor getRealtor() {
        return this.realtor;
    }

    public void setRealtor(Realtor realtor) {
        this.realtor = realtor;
    }

    @ManyToOne()
    @JoinColumn(name = "user_id", nullable = false)
    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @ManyToOne()
    @JoinColumn(name = "realty_obj_id", nullable = false)
    public RealtyObject getRealtyObj() {
        return this.realtyObj;
    }

    public void setRealtyObj(RealtyObject realtyObj) {
        this.realtyObj = realtyObj;
    }

    @Column(name = "date_time")
    public Instant getDateTime() {
        return dateTime;
    }

    public void setDateTime(Instant dateTime) {
        this.dateTime = dateTime;
    }
}

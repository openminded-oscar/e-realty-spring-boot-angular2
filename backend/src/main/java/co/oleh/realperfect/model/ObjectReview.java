package co.oleh.realperfect.model;

import co.oleh.realperfect.model.user.User;

import javax.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "tbl_object_review")
public class ObjectReview {
    private Long id;
    private User user;
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

    @ManyToOne()
    @JoinColumn(name = "user_id", nullable = false)
    public User getUser() {
        return this.user;
    }

    @ManyToOne()
    @JoinColumn(name = "realty_obj_id", nullable = false)
    public RealtyObject getRealtyObj() {
        return this.realtyObj;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setRealtyObj(RealtyObject realtyObj) {
        this.realtyObj = realtyObj;
    }
    
    public Instant getDateTime() {
        return dateTime;
    }

    public void setDateTime(Instant dateTime) {
        this.dateTime = dateTime;
    }
}

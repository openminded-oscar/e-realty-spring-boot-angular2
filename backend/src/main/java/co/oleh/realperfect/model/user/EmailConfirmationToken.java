package co.oleh.realperfect.model.user;

import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Data
public class EmailConfirmationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date expirationDate;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    public EmailConfirmationToken(User user) {
        this.user = user;
        this.createdDate = new Date();
        this.expirationDate = new Date(System.currentTimeMillis() + 1 * 60 * 60 * 1000); // 1-hour expiration
        this.token = UUID.randomUUID().toString();
    }
}


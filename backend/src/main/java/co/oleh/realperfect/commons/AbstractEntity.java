package co.oleh.realperfect.commons;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import java.io.Serializable;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Transient;
import org.springframework.data.domain.Persistable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = {"id"})
public class AbstractEntity implements Persistable<String>, Serializable {

  @Id
  private String id;

  @CreatedBy private String createdBy;
  @Transient private String createdByUserName;
  @LastModifiedBy private String updatedBy;
  @Transient private String updatedByUserName;

  @CreatedDate
  @JsonFormat(
      shape = JsonFormat.Shape.STRING,
      pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      timezone = "UTC")
  private Date createdAt;

  @LastModifiedDate
  @JsonFormat(
      shape = JsonFormat.Shape.STRING,
      pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      timezone = "UTC")
  private Date updatedAt;

  @Override
  @JsonIgnore
  public boolean isNew() {
    return null == id;
  }
}

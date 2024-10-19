package co.oleh.realperfect.model.user;

import javax.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailPasswordDto {
  @Email
  private String email;
  private String password;
}

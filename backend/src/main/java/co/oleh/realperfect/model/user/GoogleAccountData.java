package co.oleh.realperfect.model.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoogleAccountData {
  private String email;
  private String idToken;
  private String authToken;
  private String authorizationCode;
  private String type;
}

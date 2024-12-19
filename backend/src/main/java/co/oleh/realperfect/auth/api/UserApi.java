package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.CredentialsValidator;
import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.emails.EmailsService;
import co.oleh.realperfect.mapping.UserProfileDto;
import co.oleh.realperfect.mapping.UserSelfDto;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.model.user.*;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping(value = "/api/user")
@AllArgsConstructor
@Slf4j
public class UserApi {
    private final MappingService mappingService;
    private UserService userService;
    private EmailsService emailSenderService;
    private CredentialsValidator credentialsValidator;

    @InitBinder("credentials")
    protected void initBinder(WebDataBinder binder) {
        binder.setValidator(credentialsValidator);
    }

    @PostMapping
    public UserSelfDto create(@Valid @RequestBody EmailPasswordDto credentials) {
        User user = new User();

        user.setLogin(credentials.getEmail());
        user.setEmail(credentials.getEmail());
        user.setPassword(credentials.getPassword());
        user.setUserConfirmed(false);

        userService.save(user);
        try {
            emailSenderService.sendEmailRegistrationConfirm(user);
        } catch (Exception e) {
            log.error("ErrorWhileSendingUserAccountConfirmation letter {}. Details: {}", user.getEmail(),
                    e.getMessage());
        }

        return this.mappingService.map(user, UserSelfDto.class);
    }

    @GetMapping("/confirm")
    public ResponseEntity<String> userEmailConfirmation(@RequestParam("token") String token) {
        EmailConfirmationStatus status = userService.confirmUserByToken(token);

        return switch (status) {
            case TOKEN_NOT_FOUND -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Token not found.");
            case TOKEN_EXPIRED -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token is invalid or expired.");
            case USER_ALREADY_CONFIRMED ->
                    ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User is already confirmed.");
            case EMAIL_CONFIRMED -> ResponseEntity.ok("Email confirmed successfully. Your account is now active.");
        };
    }

    @PatchMapping
    public UserSelfDto updateMyProfile(@AuthenticationPrincipal SpringSecurityUser currentUser,
                                       @Valid @RequestBody UserProfileDto user) {
        return userService.patchProfile(currentUser.getId(), user);
    }

    @PostMapping("/forgot-password")
    public Map<String, Boolean> forgotPassword(@Valid @RequestBody ForgotPasswordDto forgotPasswordDto) throws MessagingException {
        String email = forgotPasswordDto.getEmail();
        User user = this.userService.findByLogin(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
        try {
            emailSenderService.sendForgotPasswordConfirm(user);
        } catch (Exception e) {
            log.error("ErrorWhileSendingUserForgotPasswordConfirmation letter {}. Details: {}", user.getEmail(),
                    e.getMessage());
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return Map.ofEntries(Map.entry("forgotPasswordConfirmation", true));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordDto forgotPasswordDto) {
        ResetPasswordStatus status =
                this.userService.resetPassword(forgotPasswordDto);

        return switch (status) {
            case TOKEN_NOT_FOUND -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Token not found.");
            case TOKEN_EXPIRED -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token is invalid or expired.");
            case EMAIL_CONFIRMED -> ResponseEntity.ok("Password reset successfully!");
        };
    }
}

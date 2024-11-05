package co.oleh.realperfect.auth.api;

import co.oleh.realperfect.auth.CredentialsValidator;
import co.oleh.realperfect.auth.SpringSecurityUser;
import co.oleh.realperfect.auth.UserService;
import co.oleh.realperfect.emails.EmailSenderService;
import co.oleh.realperfect.mapping.UserProfileDto;
import co.oleh.realperfect.mapping.UserSelfDto;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.model.user.EmailPasswordDto;
import co.oleh.realperfect.model.user.User;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping(value = "/api/user")
@AllArgsConstructor
@Slf4j
public class UserApi {
    private final MappingService mappingService;
    private UserService userService;
    private EmailSenderService emailSenderService;
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
            emailSenderService.sendEmailRegistrationConfirm(user.getEmail());
        } catch (Exception e) {
            log.error("ErrorWhileSendingUserAccountConfirmation letter {}. Details: {}", user.getEmail(), e.getMessage());
        }

        return this.mappingService.map(user, UserSelfDto.class);
    }

    @GetMapping("/confirm/{email}")
    public UserSelfDto userEmailConfirmation(@PathVariable String email) {
        User user = this.userService.findByLogin(email);

        this.userService.saveUserIsConfirmed(user.getId());

        return this.mappingService.map(user, UserSelfDto.class);
    }

    @PatchMapping
    public UserSelfDto updateMyProfile(@AuthenticationPrincipal SpringSecurityUser currentUser,
                                       @Valid @RequestBody UserProfileDto user) {
        return userService.patchProfile(currentUser.getId(), user);
    }
}

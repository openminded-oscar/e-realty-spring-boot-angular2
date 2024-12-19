package co.oleh.realperfect.emails;

import co.oleh.realperfect.mapping.ObjectReviewDto;
import co.oleh.realperfect.model.ObjectReview;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.user.EmailConfirmationToken;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.repository.EmailConfirmationTokenRepository;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Arrays;
import java.util.Collections;

@Service
@Slf4j
public class EmailsService {
    @Value("${server.apiRoot}")
    private String apiRoot;
    @Value("${server.appRoot}")
    private String appRoot;

    private final EmailUtilityService emailUtilityService;
    private final TemplateEngine templateEngine;
    private final EmailConfirmationTokenRepository emailConfirmationTokenRepository;

    public EmailsService(EmailUtilityService emailUtilityService,
                         TemplateEngine templateEngine,
                         EmailConfirmationTokenRepository emailConfirmationTokenRepository) {
        this.emailUtilityService = emailUtilityService;
        this.templateEngine = templateEngine;
        this.emailConfirmationTokenRepository = emailConfirmationTokenRepository;
    }

    public void sendForgotPasswordConfirm(User user) throws MessagingException {
        EmailConfirmationToken tokenEntity = new EmailConfirmationToken(user);
        String tokenString = tokenEntity.getToken();

        this.emailConfirmationTokenRepository.save(tokenEntity);

        String htmlContent = String.format("""
                Hereby reset password at RealPerfect Best realty service!
                Your resetting key is %s.</br>
                We recommend that you use unique, long, complex passwords for all of your accounts. To make generating and remembering your passwords easier, we also suggest using a password management tool.
                """, tokenString);
        String email = user.getEmail();
        this.emailUtilityService.sendHtmlMessage(Collections.singletonList(email), "Password Recovery",
                htmlContent);
        log.info("Email confirmation sent to {}", email);
    }

    public void sendEmailRegistrationConfirm(User user) throws MessagingException {
        EmailConfirmationToken tokenEntity = new EmailConfirmationToken(user);
        String tokenString = tokenEntity.getToken();

        this.emailConfirmationTokenRepository.save(tokenEntity);
        String confirmationLink = String.format("%s/api/user/confirm?token=%s", apiRoot, tokenString);
        String htmlContent = String.format("""
                Congrats, you have successfully registered at The Best realty service!
                <a href=\"%s\">Click here to complete registration</a>
                """, confirmationLink);
        String email = user.getEmail();
        this.emailUtilityService.sendHtmlMessage(Collections.singletonList(email), "Registration Confirmation",
                htmlContent);
        log.info("Email confirmation sent to {}", email);
    }

    public void sendObjectReviewCancelForUser(String reason, User user, ObjectReview objectReview,
                                              RealtyObject realtyObject,
                                              Realtor realtor) throws MessagingException {
        String email = user.getEmail();

        Context context = new Context();
        context.setVariable("appRoot", appRoot);
        if (reason != null) {
            context.setVariable("reason", reason);
        }
        context.setVariable("reviewId", objectReview.getId());
        context.setVariable("user", user);
        context.setVariable("realtyObject", realtyObject);
        String htmlContent = templateEngine.process("userObjectReviewCanceled", context);

        this.emailUtilityService.sendHtmlMessageAsync(Arrays.asList(email, realtor.getUser().getEmail()),
                "RealPerfect Object Review Removed",
                htmlContent);

        log.info("RealPerfectObjectReview removed sent to user {}", email);
    }

    public void sendObjectReviewSetForUser(User user, ObjectReviewDto objectReview, RealtyObject realtyObject,
                                           Realtor realtor) throws MessagingException {
        String email = user.getEmail();

        Context context = new Context();
        context.setVariable("appRoot", appRoot);
        context.setVariable("reviewId", objectReview.getId());
        context.setVariable("user", user);
        context.setVariable("realtyObject", realtyObject);
        String htmlContent = templateEngine.process("userObjectReviewScheduled", context);

        this.emailUtilityService.sendHtmlMessageAsync(Collections.singletonList(email),
                "RealPerfect Object Review Scheduled And Send To Realtor",
                htmlContent);

        log.info("RealPerfectObjectReview sent to user {}", email);
    }

    public void sendNewObjectSetForRealtor(User user,
                                              RealtyObject realtyObject,
                                              Realtor realtor) {
        String realtorEmail = realtor.getUser().getEmail();

        Context context = new Context();
        context.setVariable("appRoot", appRoot);
        context.setVariable("user", user);
        context.setVariable("realtyObject", realtyObject);
        String htmlContent = templateEngine.process("userObjectAddedForRealtorEmail", context);

        this.emailUtilityService.sendHtmlMessageAsync(Collections.singletonList(realtorEmail),
                "New Realty Object Added For you As Realtor",
                htmlContent);
        log.info("RealPerfectObjectAdded {} sent to realtor {}", realtyObject.getId(), realtorEmail);
    }

    public void sendObjectReviewSetForRealtor(User user,
                                              ObjectReviewDto objectReview,
                                              RealtyObject realtyObject,
                                              Realtor realtor) throws MessagingException {
        String email = realtor.getUser().getEmail();

        Context context = new Context();
        context.setVariable("appRoot", appRoot);
        context.setVariable("user", user);
        context.setVariable("realtyObject", realtyObject);
        context.setVariable("reviewId", objectReview.getId());
        String htmlContent = templateEngine.process("userObjectReviewScheduledForRealtor", context);

        this.emailUtilityService.sendHtmlMessageAsync(Collections.singletonList(email),
                "RealPerfect Object Review Scheduled And Waiting Confirmation",
                htmlContent);
        log.info("RealPerfectObjectReview {} sent to realtor {}", objectReview.getId(), email);
    }

    public void sendObjectReviewApproved(User userFromDb, ObjectReview objectReview, RealtyObject realtyObj,
                                            Realtor realtor) throws MessagingException {
        String email = userFromDb.getEmail();

        Context context = new Context();
        context.setVariable("appRoot", appRoot);
        context.setVariable("user", userFromDb);
        context.setVariable("realtyObject", realtyObj);
        context.setVariable("reviewId", objectReview.getId());

        String htmlContent = templateEngine.process("userObjectReviewApproved", context);

        this.emailUtilityService.sendHtmlMessageAsync(Arrays.asList(email, realtor.getUser().getEmail()),
                "RealPerfect Object Review Approved!",
                htmlContent);
        log.info("RealPerfectObjectReview {} approved", objectReview.getId());
    }
}

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
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Arrays;
import java.util.Collections;

@Service
@Slf4j
public class EmailsByPurposeService {
    @Value("${server.apiRoot}")
    private String apiRoot;
    @Value("${server.appRoot}")
    private String appRoot;

    private final EmailUtilityService emailUtilityService;
    private final TemplateEngine templateEngine;
    private final EmailConfirmationTokenRepository emailConfirmationTokenRepository;

    public EmailsByPurposeService(EmailUtilityService emailUtilityService,
                                  TemplateEngine templateEngine,
                                  EmailConfirmationTokenRepository emailConfirmationTokenRepository) {
        this.emailUtilityService = emailUtilityService;
        this.templateEngine = templateEngine;
        this.emailConfirmationTokenRepository = emailConfirmationTokenRepository;
    }

    @Async
    public void sendObjectReviewCancelAsync(String reason,
                                            User user,
                                            ObjectReview objectReview,
                                            RealtyObject realtyObject,
                                            Realtor realtor) {
        try {
            sendObjectReviewCancelForUser(reason, user, objectReview, realtyObject, realtor);
            log.info("completeAsyncSendObjectReviewCancelForUser {}: {}", user.getId(), objectReview.getId());
        } catch (MessagingException e) {
            log.error("errorCode: sendObjectReviewCancel | userId: {} | objectReviewId: {} | reason: {}",
                    user.getId(), objectReview.getId(), reason, e);
        }
    }

    @Async
    public void sendObjectReviewSetForUserAsync(User user,
                                                ObjectReviewDto objectReview,
                                                RealtyObject realtyObject,
                                                Realtor realtor) {
        try {
            sendObjectReviewSetForUser(user, objectReview, realtyObject, realtor);
            log.info("completeAsyncSendObjectReviewSetForUser {}: {}", user.getId(), objectReview.getId());
        } catch (MessagingException e) {
            log.error("errorCode: sendObjectReviewSetForUser | userId: {} | objectReviewDtoId: {} | realtyObjectId: {}",
                    user.getId(), objectReview.getId(), realtyObject.getId(), e);
        }
    }

    @Async
    public void sendObjectReviewSetForRealtorAsync(User user,
                                                   ObjectReviewDto objectReview,
                                                   RealtyObject realtyObject,
                                                   Realtor realtor) {
        try {
            sendObjectReviewSetForRealtor(user, objectReview, realtyObject, realtor);
            log.info("completeAsyncSendObjectReviewSetForRealtor {}: {}", user.getId(), objectReview.getId());
        } catch (MessagingException e) {
            log.error("errorCode: sendObjectReviewSetForRealtor | userId: {} | objectReviewDtoId: {} | realtyObjectId: {}",
                    user.getId(), objectReview.getId(), realtyObject.getId(), e);
        }
    }

    @Async
    public void sendObjectReviewApprovedAsync(User userFromDb, ObjectReview objectReview, RealtyObject realtyObj,
                                              Realtor realtor) {
        try {
            this.sendObjectReviewApproved(userFromDb, objectReview, realtyObj, realtor);
            log.info("completeAsyncSendObjectReviewApproved {}: {}", userFromDb.getId(), objectReview.getId());
        } catch (MessagingException e) {
            log.error("errorCode: sendObjectReviewApproved | userId: {} | objectReviewId: {} | realtyObjectId: {}",
                    userFromDb.getId(), objectReview.getId(), realtyObj.getId(), e);
        }
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

        this.emailUtilityService.sendHtmlMessage(Arrays.asList(email, realtor.getUser().getEmail()),
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

        this.emailUtilityService.sendHtmlMessage(Collections.singletonList(email),
                "RealPerfect Object Review Scheduled And Send To Realtor",
                htmlContent);

        log.info("RealPerfectObjectReview sent to user {}", email);
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

        this.emailUtilityService.sendHtmlMessage(Collections.singletonList(email),
                "RealPerfect Object Review Scheduled And Waiting Confirmation",
                htmlContent);
        log.info("RealPerfectObjectReview {} sent to realtor {}", objectReview.getId(), email);
    }

    protected void sendObjectReviewApproved(User userFromDb, ObjectReview objectReview, RealtyObject realtyObj,
                                            Realtor realtor) throws MessagingException {
        String email = userFromDb.getEmail();

        Context context = new Context();
        context.setVariable("appRoot", appRoot);
        context.setVariable("user", userFromDb);
        context.setVariable("realtyObject", realtyObj);
        context.setVariable("reviewId", objectReview.getId());

        String htmlContent = templateEngine.process("userObjectReviewApproved", context);

        this.emailUtilityService.sendHtmlMessage(Arrays.asList(email, realtor.getUser().getEmail()),
                "RealPerfect Object Review Approved!",
                htmlContent);
        log.info("RealPerfectObjectReview {} approved", objectReview.getId());
    }
}

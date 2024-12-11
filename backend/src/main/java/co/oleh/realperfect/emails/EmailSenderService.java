package co.oleh.realperfect.emails;

import co.oleh.realperfect.mapping.ObjectReviewDto;
import co.oleh.realperfect.model.ObjectReview;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.user.EmailConfirmationToken;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.repository.EmailConfirmationTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class EmailSenderService {
    @Value("${server.apiRoot}")
    private String apiRoot;
    @Value("${server.appRoot}")
    private String appRoot;

    private final JavaMailSender emailSender;
    private final TemplateEngine templateEngine;
    private final EmailConfirmationTokenRepository emailConfirmationTokenRepository;

    public EmailSenderService(JavaMailSender emailSender,
                              TemplateEngine templateEngine,
                              EmailConfirmationTokenRepository emailConfirmationTokenRepository) {
        this.emailSender = emailSender;
        this.templateEngine = templateEngine;
        this.emailConfirmationTokenRepository = emailConfirmationTokenRepository;
    }

    public CompletableFuture<Void> sendObjectReviewCancelAsync(String reason,
                                                               User user,
                                                               ObjectReview objectReview,
                                                               RealtyObject realtyObject,
                                                               Realtor realtor) {
        return CompletableFuture.runAsync(() -> {
            try {
                sendObjectReviewCancelForUser(reason, user, objectReview, realtyObject, realtor);
                log.info("completeAsyncSendObjectReviewCancelForUser {}: {}", user.getId(), objectReview.getId());
            } catch (MessagingException e) {
                log.error(e.getMessage(), e);
            }
        });
    }

    public CompletableFuture<Void> sendObjectReviewSetForUserAsync(User user,
                                                                   ObjectReviewDto objectReview,
                                                                   RealtyObject realtyObject,
                                                                   Realtor realtor) {
        return CompletableFuture.runAsync(() -> {
            try {
                sendObjectReviewSetForUser(user, objectReview, realtyObject, realtor);
                log.info("completeAsyncSendObjectReviewSetForUser {}: {}", user.getId(), objectReview.getId());
            } catch (MessagingException e) {
                log.error(e.getMessage(), e);
            }
        });
    }

    public CompletableFuture<Void> sendObjectReviewSetForRealtorAsync(User user,
                                                                      ObjectReviewDto objectReview,
                                                                      RealtyObject realtyObject,
                                                                      Realtor realtor) {
        return CompletableFuture.runAsync(() -> {
            try {
                sendObjectReviewSetForRealtor(user, objectReview, realtyObject, realtor);
                log.info("completeAsyncSendObjectReviewSetForUser {}: {}", user.getId(), objectReview.getId());
            } catch (MessagingException e) {
                log.error(e.getMessage(), e);
            }
        });
    }


    public void sendEmailRegistrationConfirm(User user) throws MessagingException {
        EmailConfirmationToken tokenEntity = new EmailConfirmationToken(user);
        String tokenString = tokenEntity.getToken();

        this.emailConfirmationTokenRepository.save(tokenEntity);
        String confirmationLink = String.format("%s/api/user/confirm?token=%s", apiRoot, tokenString);
        String htmlContent = String.format("""
                Congrats, you have successfully registered at The Best realty service!
                <a href="%s">Click here to complete registration</a>
                """, confirmationLink);
        String email = user.getEmail();
        this.sendHtmlMessage(Collections.singletonList(email), "Registration Confirmation", htmlContent);
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

        this.sendHtmlMessage(Arrays.asList(email, realtor.getUser().getEmail()),
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

        this.sendHtmlMessage(Collections.singletonList(email),
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

        this.sendHtmlMessage(Collections.singletonList(email),
                "RealPerfect Object Review Scheduled And Waiting Confirmation",
                htmlContent);
        log.info("RealPerfectObjectReview sent to realtor {}", email);
    }

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@noreply.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        emailSender.send(message);
    }

    private void sendHtmlMessage(List<String> to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("noreply@noreply.com");
        helper.setTo(to.toArray(new String[0]));
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        emailSender.send(message);
    }
}
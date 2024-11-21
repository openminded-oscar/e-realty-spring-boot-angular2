package co.oleh.realperfect.emails;

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

@Service
@Slf4j
public class EmailSenderService {
    @Value("${server.apiRoot}")
    private String apiRoot;

    private final JavaMailSender emailSender;
    private final EmailConfirmationTokenRepository emailConfirmationTokenRepository;

    public EmailSenderService(JavaMailSender emailSender,
                              EmailConfirmationTokenRepository emailConfirmationTokenRepository) {
        this.emailSender = emailSender;
        this.emailConfirmationTokenRepository = emailConfirmationTokenRepository;
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
        this.sendHtmlMessage(email, "Registration Confirmation", htmlContent);
        log.info("Email confirmation sent to {}", email);
    }

    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@noreply.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        emailSender.send(message);
    }

    private void sendHtmlMessage(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("noreply@noreply.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        emailSender.send(message);
    }
}
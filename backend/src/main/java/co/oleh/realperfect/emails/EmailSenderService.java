package co.oleh.realperfect.emails;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
@Slf4j
public class EmailSenderService {
    @Value("${server.apiRoot}")
    private String apiRoot;

    private JavaMailSender emailSender;

    public EmailSenderService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendEmailRegistrationConfirm(String to) throws MessagingException {
        String confirmationLink = String.format("%s/api/user/confirm/%s", apiRoot, to);
        String htmlContent = String.format("""
        Congrats, you have successfully registered at The Best realty service!
        <a href="%s">Click here to complete registration</a>
        """, confirmationLink);

        this.sendHtmlMessage(to,
                "Registration Confirmation",
                htmlContent
        );
        log.info("Email confirmation sent to {}", to);
    }

    public void sendSimpleMessage(
            String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@noreply.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        emailSender.send(message);
    }

    private void sendHtmlMessage(String to,
                                 String subject,
                                 String htmlBody) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("noreply@noreply.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        emailSender.send(message);
    }
}
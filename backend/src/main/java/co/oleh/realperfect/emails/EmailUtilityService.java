package co.oleh.realperfect.emails;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class EmailUtilityService {
    private final JavaMailSender emailSender;

    public EmailUtilityService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Async
    public void sendHtmlMessageAsync(List<String> to, String subject, String htmlBody) {
        try {
            this.sendHtmlMessage(to, subject, htmlBody);
        } catch (MessagingException e) {
            log.error("EmailSendingAsyncException {} for subject {}", e.getMessage(), subject );
        }

    }

    public void sendHtmlMessage(List<String> to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom("noreply@noreply.com");
        helper.setTo(to.toArray(new String[0]));
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        emailSender.send(message);
    }

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@noreply.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }
}
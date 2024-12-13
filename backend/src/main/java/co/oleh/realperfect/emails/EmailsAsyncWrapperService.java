package co.oleh.realperfect.emails;

import co.oleh.realperfect.mapping.ObjectReviewDto;
import co.oleh.realperfect.model.ObjectReview;
import co.oleh.realperfect.model.Realtor;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.user.User;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailsAsyncWrapperService {
    private final EmailsByPurposeService emailsByPurposeService;

    public EmailsAsyncWrapperService(EmailsByPurposeService emailsByPurposeService) {
        this.emailsByPurposeService = emailsByPurposeService;
    }

    @Async
    public void sendObjectReviewCancelAsync(String reason,
                                            User user,
                                            ObjectReview objectReview,
                                            RealtyObject realtyObject,
                                            Realtor realtor) {
        try {
            this.emailsByPurposeService.sendObjectReviewCancelForUser(reason, user, objectReview, realtyObject,
                    realtor);
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
            this.emailsByPurposeService.sendObjectReviewSetForUser(user, objectReview, realtyObject, realtor);
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
            this.emailsByPurposeService.sendObjectReviewSetForRealtor(user, objectReview, realtyObject, realtor);
            log.info("completeAsyncSendObjectReviewSetForRealtor {}: {}", user.getId(), objectReview.getId());
        } catch (MessagingException e) {
            log.error("errorCode: sendObjectReviewSetForRealtor | userId: {} | objectReviewDtoId: {} | " +
                            "realtyObjectId: {}",
                    user.getId(), objectReview.getId(), realtyObject.getId(), e);
        }
    }

    @Async
    public void sendObjectReviewApprovedAsync(User userFromDb, ObjectReview objectReview, RealtyObject realtyObj,
                                              Realtor realtor) {
        try {
            this.emailsByPurposeService.sendObjectReviewApproved(userFromDb, objectReview, realtyObj, realtor);
            log.info("completeAsyncSendObjectReviewApproved {}: {}", userFromDb.getId(), objectReview.getId());
        } catch (MessagingException e) {
            log.error("errorCode: sendObjectReviewApproved | userId: {} | objectReviewId: {} | realtyObjectId: {}",
                    userFromDb.getId(), objectReview.getId(), realtyObj.getId(), e);
        }
    }
}

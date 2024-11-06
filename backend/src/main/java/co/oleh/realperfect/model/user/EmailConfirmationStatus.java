package co.oleh.realperfect.model.user;

public enum EmailConfirmationStatus {
    TOKEN_NOT_FOUND,
    TOKEN_EXPIRED,
    USER_ALREADY_CONFIRMED,
    EMAIL_CONFIRMED
}
package co.oleh.realperfect.mapping;

import co.oleh.realperfect.model.photos.UserPhoto;

public record RealtorDto(Long id, String name, String email, String surname, String phoneNumber, UserPhoto profilePic) {}

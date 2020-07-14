package co.oleh.realperfect.repository;

import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.model.photos.UserPhoto;
import org.springframework.data.repository.CrudRepository;

public interface ProfilePhotoRepository extends CrudRepository<UserPhoto, Long> {
}

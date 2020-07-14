package co.oleh.realperfect.pictures;

import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.model.photos.UserPhoto;
import co.oleh.realperfect.repository.ProfilePhotoRepository;
import co.oleh.realperfect.repository.RealtyObjectPhotoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PictureInfoService {
    private RealtyObjectPhotoRepository pictureRepository;

    private ProfilePhotoRepository profilePhotoRepository;

    public RealtyObjectPhoto save(RealtyObjectPhoto pictureInfo) {
        return pictureRepository.save(pictureInfo);
    }

    public UserPhoto save(UserPhoto pictureInfo) {
        return profilePhotoRepository.save(pictureInfo);
    }
}

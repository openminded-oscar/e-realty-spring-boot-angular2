package co.oleh.realperfect.pictures;

import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.repository.RealtyObjectPhotoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PictureInfoService {
    @Autowired
    private RealtyObjectPhotoRepository pictureRepository;

    public RealtyObjectPhoto save(RealtyObjectPhoto pictureInfo) {
        return pictureRepository.save(pictureInfo);
    }
}

package co.oleh.realperfect.pictures;

import co.oleh.realperfect.model.PictureInfo;
import co.oleh.realperfect.repository.PictureInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PictureInfoService {
    @Autowired
    private PictureInfoRepository pictureRepository;

    public void save(PictureInfo pictureInfo) {
        pictureRepository.save(pictureInfo);
    }
}

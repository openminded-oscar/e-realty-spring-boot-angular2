package co.oleh.realperfect.misc.services.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {
    void uploadFileForCategoryAndUser(MultipartFile file, String category, String userId);

    Stream<Path> listAllPicsForCategoryAndUser(String category, String userId);

    Resource downloadFileAsResourceForCategoryAndUser(String filename, String category, String someId);

    void deleteAll();
}

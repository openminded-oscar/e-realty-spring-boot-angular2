package co.oleh.realperfect.filesmanaging;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.stream.Stream;

public interface StorageService {
    String uploadFileForCategoryAndUser(MultipartFile file, String filename, String category, String userId);

    Stream<Path> listAllPicsForCategoryAndUser(String category, String userId);

    Resource downloadFileAsResourceForCategoryAndUser(String filename, String category, String someId);

    void deleteAll();
}

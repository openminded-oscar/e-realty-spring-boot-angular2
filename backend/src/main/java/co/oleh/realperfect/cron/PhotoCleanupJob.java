package co.oleh.realperfect.cron;

import co.oleh.realperfect.pictures.FileSystemStorageService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@AllArgsConstructor
@Slf4j
public class PhotoCleanupJob {
    private final JdbcTemplate jdbcTemplate;
    private final FileSystemStorageService fileSystemStorageService;

    @Scheduled(cron = "0 0 3 * * ?") // Runs every day at 3 AM
    public void cleanupPhotosInFileStorage() {
        Set<String> filenamesInDb = fetchFilenamesFromDatabase();
        List<String> allFilesNames = fetchAllFilesFromStorage();

        List<String> fileNamesToDelete = allFilesNames.stream()
                .filter(name -> !filenamesInDb.contains(name)).toList();
        log.info("Number of files to delete: " + fileNamesToDelete.size());
        fileNamesToDelete.forEach(this::deleteFileInStorage);
    }

    private Set<String> fetchFilenamesFromDatabase() {
        Set<String> filenamesInDb = new HashSet<>();
        try {
            filenamesInDb.addAll(jdbcTemplate.queryForList("SELECT filename FROM tbl_user_photo", String.class));
            filenamesInDb.addAll(jdbcTemplate.queryForList("SELECT filename FROM tbl_confirmation_doc_photo", String.class));
            filenamesInDb.addAll(jdbcTemplate.queryForList("SELECT filename FROM tbl_realty_object_photo", String.class));
        } catch (Exception e) {
            log.error("[cleanupPhotos] [Database Query] Error querying database for filenames:", e);
            throw e;
        }
        return filenamesInDb;
    }

    private List<String> fetchAllFilesFromStorage() {
        try {
            return fileSystemStorageService.listAllFilesInRootLocation();
        } catch (Exception e) {
            log.error("[cleanupPhotos] [File Retrieval] Error retrieving file names from storage", e);
            throw e;
        }
    }

    private void deleteFileInStorage(String filename) {
        try {
            fileSystemStorageService.deleteByName(filename);
            log.info("[cleanupPhotos] [File Deletion] Deleted file: {}", filename);
        } catch (Exception e) {
            log.error("[cleanupPhotos] [File Deletion] Error deleting file: {}", filename, e);
        }
    }
}

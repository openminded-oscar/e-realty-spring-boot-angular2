package co.oleh.realperfect.pictures;

import co.oleh.realperfect.model.photos.ConfirmationDocPhoto;
import co.oleh.realperfect.model.photos.Photo;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.model.photos.UserPhoto;
import co.oleh.realperfect.ratelimiter.RateLimited;
import lombok.AllArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;
import java.util.UUID;

@Controller
@AllArgsConstructor
@RequestMapping("/api")
public class FileUploadController {
    private FileSystemStorageService storageService;
    private PictureInfoService pictureInfoService;


    @PostMapping(value = "/upload-photo/{type}", produces = "application/json")
    @PreAuthorize("isAuthenticated()")
    @RateLimited(requestsPerHour = 200)
    public ResponseEntity<Photo> handleFileUpload(@RequestParam("file") MultipartFile file, @PathVariable String type) {
        String filename = generateUuidFilename(file);

        storageService.uploadFile(file, filename);

        Photo photo = switch (type) {
            case "object" -> pictureInfoService.save(new RealtyObjectPhoto(filename));
            case "confirm-object" -> pictureInfoService.save(new ConfirmationDocPhoto(filename));
            case "profile" -> pictureInfoService.save(new UserPhoto(filename));
            default -> null;
        };

        return new ResponseEntity<>(photo, HttpStatus.ACCEPTED);
    }

    private String generateUuidFilename(MultipartFile file) {
        String[] filenameParts = Objects.requireNonNull(file.getOriginalFilename()).split("\\.");

        return UUID.randomUUID() + "." + filenameParts[filenameParts.length - 1];
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Resource file = storageService.downloadFileAsResource(filename);
        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }
}
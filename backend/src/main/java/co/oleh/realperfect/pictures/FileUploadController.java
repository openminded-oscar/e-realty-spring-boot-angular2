package co.oleh.realperfect.pictures;

import co.oleh.realperfect.model.photos.ConfirmationDocPhoto;
import co.oleh.realperfect.model.photos.Photo;
import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
import co.oleh.realperfect.model.photos.UserPhoto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class FileUploadController {
    @Autowired
    private FileSystemStorageService storageService;

    @Autowired
    private PictureInfoService pictureInfoService;


    @PostMapping(value = "/upload-photo/{type}", produces = "application/json")
    public ResponseEntity<Photo> handleFileUpload(@RequestParam("file") MultipartFile file, @PathVariable String type) {
        String filename = generateUuidFilename(file);
        storageService.uploadFileForCategoryAndUser(file, filename, "category", "someId");

        Photo photo = null;
        if (type.equals("object")) {
            photo = pictureInfoService.save(new RealtyObjectPhoto(filename));
        }  else if (type.equals("confirm-object")) {
            photo = pictureInfoService.save(new ConfirmationDocPhoto(filename));
        } else if (type.equals("profile")) {
            photo = pictureInfoService.save(new UserPhoto(filename));
        }

        return new ResponseEntity<>(photo, HttpStatus.ACCEPTED);
    }

    private String generateUuidFilename(MultipartFile file) {
        String[] filenameParts = file.getOriginalFilename().split("\\.");
        String filename = UUID.randomUUID().toString() + "." + filenameParts[filenameParts.length - 1];

        return filename;
    }

    @GetMapping("/list-uploaded-photos")
    public ResponseEntity<List<String>> listUploadedFiles() throws IOException {
        List<String> fileNamesList = storageService
                .listAllPicsForCategoryAndUser("category", "someId")
                .map(path ->
                        MvcUriComponentsBuilder
                                .fromMethodName(FileUploadController.class, "serveFile", path.getFileName().toString())
                                .build().toString())
                .collect(Collectors.toList());

        return ResponseEntity
                .ok()
                .body(fileNamesList);
    }

    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        Resource file = storageService.downloadFileAsResourceForCategoryAndUser(filename, "category", "someId");
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
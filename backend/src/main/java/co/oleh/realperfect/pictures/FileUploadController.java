package co.oleh.realperfect.pictures;

import co.oleh.realperfect.model.photos.RealtyObjectPhoto;
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


    @PostMapping(value = "/upload-photo", produces = "application/json")
    public ResponseEntity<RealtyObjectPhoto> handleFileUpload(@RequestParam("file") MultipartFile file) {
        String filename = generateUuidFilename(file);
        storageService.uploadFileForCategoryAndUser(file, filename, "category", "someId");

        RealtyObjectPhoto pictureInfo = pictureInfoService.save(new RealtyObjectPhoto(filename));

        return new ResponseEntity<>(pictureInfo, HttpStatus.ACCEPTED);
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
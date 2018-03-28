package co.oleh.realperfect.misc.services;

import co.oleh.realperfect.misc.services.storage.StorageFileNotFoundException;
import co.oleh.realperfect.misc.services.storage.StorageService;
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
import java.util.stream.Collectors;

@Controller
public class FileUploadController {

    @Autowired
    private StorageService storageService;

    @GetMapping("/uploaded-files-list")
    public ResponseEntity<List<String>> listUploadedFiles() throws IOException {
        List<String> fileNamesList = storageService
                .loadAll()
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
        Resource file = storageService.loadAsResource(filename);
        return ResponseEntity
                .ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<Void> handleFileUpload(@RequestParam("file") MultipartFile file,
                                                   @RequestParam(name = "category", required = true) String fileCategory,
                                                   @RequestParam("userId") String userId) {
        storageService.storeFileWithCategoryForUser(file, fileCategory, userId);

        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }

    @ExceptionHandler(StorageFileNotFoundException.class)
    public ResponseEntity handleStorageFileNotFound(StorageFileNotFoundException exc) {
        return ResponseEntity.notFound().build();
    }

}
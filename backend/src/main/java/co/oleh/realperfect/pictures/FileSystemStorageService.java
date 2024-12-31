package co.oleh.realperfect.pictures;


import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class FileSystemStorageService implements InitializingBean {
    @Value("${realtypics.storage.root}")
    private final String rootLocationString = null;
    private Path rootLocation = null;

    @Override
    public void afterPropertiesSet() {
        try {
            this.rootLocation = Paths.get(rootLocationString);
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new StorageException("Could not initialize storage", e);
        }
    }

    public String uploadFile(MultipartFile file, String filename) {
        try {
            Path path = prepareForFileStorageAndReturnPath(file, filename);
            Files.copy(file.getInputStream(), path);
            return path.getFileName().toString();
        } catch (IOException e) {
            throw new StorageException("Failed to store file " + file.getOriginalFilename(), e);
        }
    }

    public Resource downloadFileAsResource(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new StorageFileNotFoundException("Could not read file: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new StorageFileNotFoundException("Could not read file: " + filename, e);
        }
    }


    public List<String> listAllFilesInRootLocation() {
        return Arrays.stream(rootLocation.toFile().listFiles())
                .filter(file -> !file.isDirectory())
                .map(File::getName)
                .toList();
    }

    public boolean deleteByName(String filename) {
        return new File(rootLocation.toFile(), filename).delete();
    }

    public void deleteAll() {
        FileSystemUtils.deleteRecursively(rootLocation.toFile());
    }

    private Path prepareForFileStorageAndReturnPath(MultipartFile file, String filename) throws IOException {
        if (file.isEmpty()) {
            throw new StorageException("Failed to store empty file " + file.getOriginalFilename());
        }
        File photoFolder = this.rootLocation.toFile();
        if (!photoFolder.exists()) {
            photoFolder.mkdirs();
        }

        Path path = this.rootLocation.resolve(filename);
        Files.deleteIfExists(path);

        return path;
    }
}
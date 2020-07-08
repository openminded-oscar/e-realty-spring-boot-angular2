package co.oleh.realperfect.commons;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collection;
import java.util.Optional;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;

@Slf4j
public abstract class AbstractCrudController<T extends AbstractEntity> {

  protected final CrudService<T> crudService;
//  private CrudService<User> userService;

  private static final ObjectMapper MAPPER = new ObjectMapper();

  AbstractCrudController(CrudService<T> crudService) {
    this.crudService = crudService;
  }

  // Injecting user service for creator/updater user name lookup
//  @Autowired
//  public void setUserService(CrudService<User> userService) {
//    this.userService = userService;
//  }

  public ResponseEntity<T> create(T entity) {
    T saved = createEntity(entity);
    return new ResponseEntity<>(saved, HttpStatus.CREATED);
  }

  ResponseEntity<T> createWithId(T entity) {
    return new ResponseEntity<>(createEntityWithId(entity), HttpStatus.CREATED);
  }

  private T createEntityWithId(T entity) {
    entity = crudService.prepareModelBeforeSave(entity);
    T savedEntity = crudService.save(entity);
    populateCreatorAndUpdater(savedEntity);
    return savedEntity;
  }

  T createEntity(T entity) {
    if (!StringUtils.isEmpty(entity.getId())) {
      log.warn(
          "Client passed custom id in POST body: {}. New one will be generated instead", entity);
    }
    entity.setId(null);
    return createEntityWithId(entity);
  }

  public Collection<T> readAll() {
    return crudService.findAll();
  }

  public T read(String id) {
    Optional<T> maybeEntity = crudService.findOne(id);
    return maybeEntity.map(this::populateCreatorAndUpdater).orElseThrow(RuntimeException::new);
  }

  final <R extends AbstractEntity> R populateCreatorAndUpdater(R entity) {
//    Optional.ofNullable(entity.getCreatedBy())
//        .filter(Util::isValidObjectIdString)
//        .flatMap(userService::findOne)
//        .ifPresent(user -> entity.setCreatedByUserName(user.getEmail()));
//
//    Optional.ofNullable(entity.getUpdatedBy())
//        .filter(Util::isValidObjectIdString)
//        .flatMap(userService::findOne)
//        .ifPresent(user -> entity.setUpdatedByUserName(user.getEmail()));

    return entity;
  }

  final Collection<T> populateCreatorAndUpdater(Collection<T> entities) {
    return entities.stream().map(this::populateCreatorAndUpdater).collect(Collectors.toList());
  }

  public T forceUpdate(String id, final T updateEntity) {
    if (!StringUtils.isEmpty(updateEntity.getId())) {
      log.warn(
          "Client passed custom id in PUT body: {}. Using id from resource path instead: {}",
          updateEntity.getId(),
          id);
    }
    updateEntity.setId(id);
    return crudService
        .findOne(id)
        .map(
            (T entity) -> {
              updateEntity.setId(entity.getId());
              updateEntity.setCreatedAt(entity.getCreatedAt());
              updateEntity.setCreatedBy(entity.getCreatedBy());
              return crudService.update(entity, updateEntity);
            })
        .map(this::populateCreatorAndUpdater)
        .orElseGet(() -> createEntityWithId(updateEntity));
  }

  public T update(String id, final T updateEntity) {
    if (!StringUtils.isEmpty(updateEntity.getId())) {
      log.warn(
          "Client passed custom id in PUT body: {}. Using id from resource path instead: {}",
          updateEntity.getId(),
          id);
    }
    updateEntity.setId(id);
    Optional<T> maybeEntity = crudService.findOne(id);
    return update(maybeEntity, updateEntity);
  }

  protected final T update(Optional<T> existingEntity, final T updateEntity) {
    return existingEntity
        .map(
            (T entity) -> {
              updateEntity.setId(entity.getId());
              updateEntity.setCreatedAt(entity.getCreatedAt());
              updateEntity.setCreatedBy(entity.getCreatedBy());
              return crudService.update(entity, updateEntity);
            })
        .map(this::populateCreatorAndUpdater)
        .orElseThrow(RuntimeException::new);
  }

//  public ResponseEntity<T> delete(String id) {
//    Optional<T> maybeEntity = crudService.findOne(id);
//    return delete(maybeEntity);
//  }

//  protected final ResponseEntity<T> delete(Optional<T> maybeEntity) {
//    return maybeEntity
//        .map(
//            (T entity) -> {
//              crudService.delete(entity.getId());
//              return ResponseEntity.noContent().<T>build();
//            })
//        .orElseGet(notFound());
//  }

  protected final <R> Function<R, ResponseEntity<R>> noContent() {
    return item -> new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  public static <R> Supplier<ResponseEntity<R>> notFound() {
    return () -> new ResponseEntity<>(HttpStatus.NOT_FOUND);
  }

  public static <T> Supplier<ResponseEntity<T>> failedToUpdateImage() {
    return () -> new ResponseEntity("Failed to update image", HttpStatus.BAD_REQUEST);
  }

  public static <T> Supplier<ResponseEntity<T>> failedToRemoveImage() {
    return () -> new ResponseEntity("Failed to remove image", HttpStatus.BAD_REQUEST);
  }
}

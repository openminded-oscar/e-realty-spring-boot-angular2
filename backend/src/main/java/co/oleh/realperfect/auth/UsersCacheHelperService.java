package co.oleh.realperfect.auth;

import co.oleh.realperfect.config.cache.CacheNames;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

@Service
public class UsersCacheHelperService {
    @CacheEvict(value = CacheNames.USERS_CACHE, key = "#id")
    public void evictUserCache(Long id) {
    }
}

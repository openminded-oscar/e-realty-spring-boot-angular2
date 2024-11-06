package co.oleh.realperfect.config.cache;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;


@Configuration
@EnableCaching
public class CacheConfiguration {
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        cacheManager.registerCustomCache(CacheNames.REALTY_OBJECT_GALLERY_CACHE, Caffeine.newBuilder()
                .expireAfterWrite(30, TimeUnit.SECONDS)
                .maximumSize(100)
                .build());
        cacheManager.registerCustomCache(CacheNames.USERS_CACHE, Caffeine.newBuilder()
                .expireAfterWrite(1, java.util.concurrent.TimeUnit.MINUTES)
                .maximumSize(1000)
                .build()
        );
        return cacheManager;
    }
}

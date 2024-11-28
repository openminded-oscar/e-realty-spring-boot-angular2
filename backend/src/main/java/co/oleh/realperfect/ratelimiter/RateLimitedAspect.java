package co.oleh.realperfect.ratelimiter;

import co.oleh.realperfect.auth.SpringSecurityUser;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Aspect for enforcing rate limits on methods annotated with @RateLimited (per minute or per hour).
 */
@Aspect
@Component
public class RateLimitedAspect {
    private final Map<String, Bucket> userBuckets = new ConcurrentHashMap<>();

    @Before("@annotation(co.oleh.realperfect.ratelimiter.RateLimited)")
    public void checkRateLimit(JoinPoint joinPoint) {
        SpringSecurityUser user = (SpringSecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = user.getId();

        if (userId == null) {
            throw new RateLimitException("Missing userId");
        }

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RateLimited rateLimited = method.getAnnotation(RateLimited.class);

        int requestsPerMinute = rateLimited.requestsPerMinute();
        int requestsPerHour = rateLimited.requestsPerHour();

        // Ensure only one of the parameters is set
        if (requestsPerMinute >= 0 && requestsPerHour >= 0) {
            throw new RateLimitException("Cannot specify both requestsPerMinute and requestsPerHour. Please specify only one.");
        }

        if (requestsPerMinute < 0 && requestsPerHour < 0) {
            throw new RateLimitException("At least one of requestsPerMinute or requestsPerHour must be specified.");
        }

        // Determine the key and create the appropriate bucket based on the configuration
        String bucketKey = userId + ":" + method.getName(); // Unique key for user and endpoint
        Bucket bucket;

        if (requestsPerMinute != -1) {
            bucket = userBuckets.computeIfAbsent(bucketKey + ":minute", key -> createBucket(requestsPerMinute, Duration.ofMinutes(1)));
        } else {
            bucket = userBuckets.computeIfAbsent(bucketKey + ":hour", key -> createBucket(requestsPerHour, Duration.ofHours(1)));
        }

        // Check the bucket
        if (!bucket.tryConsume(1)) {
            throw new RateLimitException("Rate limit exceeded. Please try again later.");
        }
    }

    private Bucket createBucket(int requests, Duration duration) {
        Bandwidth limit = Bandwidth.classic(requests, Refill.intervally(requests, duration));
        return Bucket.builder().addLimit(limit).build();
    }
}

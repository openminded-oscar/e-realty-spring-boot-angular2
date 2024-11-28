package co.oleh.realperfect.ratelimiter;

import co.oleh.realperfect.auth.SpringSecurityUser;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;


@Aspect
@Component
public class RateLimitedAspect {
    private final Map<String, Bucket> userBuckets = new ConcurrentHashMap<>();

    @Before("@annotation(co.oleh.realperfect.ratelimiter.RateLimitedPerMinute)")
    public void checkRateLimit(JoinPoint joinPoint) {
        SpringSecurityUser user = (SpringSecurityUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = user.getId();

        if (userId == null) {
            throw new RateLimitException("Missing userId");
        }

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        RateLimitedPerMinute rateLimited = method.getAnnotation(RateLimitedPerMinute.class);

        int requestsPerMinute = rateLimited.requestsPerMinute(); // Get rate limit parameter

        String bucketKey = userId + ":" + method.getName(); // Unique key for the user and endpoint
        Bucket bucket = userBuckets.computeIfAbsent(bucketKey, key -> createBucket(requestsPerMinute));

        // Try to consume a token (i.e., make a request)
        if (!bucket.tryConsume(1)) {
            throw new RateLimitException("Too many requests. Please try again later.");
        }
    }

    private Bucket createBucket(int requestsPerMinute) {
        Bandwidth limit = Bandwidth.classic(requestsPerMinute, Refill.intervally(requestsPerMinute, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }
}

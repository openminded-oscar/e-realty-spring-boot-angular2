package co.oleh.realperfect.ratelimiter;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation for rate limiting methods.
 * Only one of `requestsPerMinute` or `requestsPerHour` should be set at a time.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimited {

    // Requests per minute (only one of these should be set)
    int requestsPerMinute() default -1;

    // Requests per hour (only one of these should be set)
    int requestsPerHour() default -1;
}

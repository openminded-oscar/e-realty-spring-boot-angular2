package co.oleh.realperfect.config.cache;

import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.Method;
import java.util.Map;

@Component("realtyObjectFilterKeyGenerator")
public class RealtyObjectsHttpQueryCacheKeyGenerator implements KeyGenerator {
    @Override
    public Object generate(Object target, Method method, Object... params) {
        HttpServletRequest request =
                ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        String requestPath = request.getRequestURI();
        String requestBody = (params.length > 0) ? params[0].toString() : "";

        // Retrieve query parameters
        StringBuilder queryStringBuilder = new StringBuilder();
        Map<String, String[]> queryParams = request.getParameterMap();
        for (Map.Entry<String, String[]> entry : queryParams.entrySet()) {
            String key = entry.getKey();
            String[] values = entry.getValue();
            for (String value : values) {
                queryStringBuilder.append(key).append("=").append(value).append("&");
            }
        }

        if (!queryStringBuilder.isEmpty()) {
            queryStringBuilder.setLength(queryStringBuilder.length() - 1); // Remove last '&'
        }

        String requestQuery = queryStringBuilder.toString();

        return requestPath + ":" + requestBody + (requestQuery.isEmpty() ? "" : "?" + requestQuery);
    }
}

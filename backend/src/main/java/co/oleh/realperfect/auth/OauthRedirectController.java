package co.oleh.realperfect.auth;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;

@Controller
public class OauthRedirectController {
    private static final String PATH = "/login/oauth2/code/*";

    @RequestMapping(value = PATH)
    public String oauth(ServletRequest request, ServletResponse response) {
        return "forward:/";
    }
}
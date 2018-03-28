package co.oleh.realperfect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;

@SpringBootApplication
@Controller
public class UiApplication {
    public static void main(String[] args) {
        SpringApplication.run(UiApplication.class, args);
    }
}
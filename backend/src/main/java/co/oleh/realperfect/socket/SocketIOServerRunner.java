package co.oleh.realperfect.socket;

import com.corundumstudio.socketio.SocketIOServer;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.LOWEST_PRECEDENCE)
@RequiredArgsConstructor
public class SocketIOServerRunner implements ApplicationRunner {
    private final SocketIOServer server;

    @Override
    public void run(ApplicationArguments args) {
        server.start();
    }
}
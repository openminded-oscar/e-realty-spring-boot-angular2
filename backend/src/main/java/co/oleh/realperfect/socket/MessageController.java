package co.oleh.realperfect.socket;

import co.oleh.realperfect.socket.model.Room;
import co.oleh.realperfect.socket.model.SocketEvent;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.annotation.OnConnect;
import com.corundumstudio.socketio.annotation.OnEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;

import java.util.Arrays;

@Controller
@RequiredArgsConstructor
public class MessageController {
  private final SocketIOServer server;

  @OnConnect
  public void onConnect(SocketIOClient client) {
    client.sendEvent(SocketEvent.LOAD_POST_PAGE.name(), "Hi there!");
    Arrays.stream(Room.values()).forEach(room -> client.joinRoom(room.name()));
  }

  @OnEvent("LOAD_POST_PAGE")
  public void onLoadPageEvent(SocketIOClient client, Object object) {
    server.getRoomOperations(Room.POST_ROOM.name()).sendEvent(SocketEvent.LOAD_POST_PAGE.name(), object);
  }
}

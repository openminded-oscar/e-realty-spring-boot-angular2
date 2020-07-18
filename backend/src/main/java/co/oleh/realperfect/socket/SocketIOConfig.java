package co.oleh.realperfect.socket;

import com.corundumstudio.socketio.AckMode;
import com.corundumstudio.socketio.SocketConfig;
import com.corundumstudio.socketio.SocketIOChannelInitializer;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.Transport;
import com.corundumstudio.socketio.annotation.SpringAnnotationScanner;
import com.corundumstudio.socketio.protocol.JacksonJsonSupport;
import com.corundumstudio.socketio.protocol.JsonSupport;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.netty.buffer.Unpooled;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpResponse;
import io.netty.handler.codec.http.HttpResponseStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ReflectionUtils;

import java.lang.reflect.Field;
import java.nio.charset.Charset;

import static io.netty.handler.codec.http.HttpVersion.HTTP_1_1;

@Configuration
public class SocketIOConfig {

    @Bean
    public SocketIOServer socketIOServer(@Value("${server.websocket.port}") int port) {
        com.corundumstudio.socketio.Configuration configuration = new com.corundumstudio.socketio.Configuration();
        configuration.setPort(port);
        configuration.setAckMode(AckMode.AUTO);

        configuration.setTransports(Transport.WEBSOCKET);
        SocketConfig socketConfig = new SocketConfig();

        socketConfig.setReuseAddress(true);

        configuration.setSocketConfig(socketConfig);
        configuration.setJsonSupport(jsonSupport());

        SocketIOServer socketIOServer = new SocketIOServer(configuration);
        socketIOServer.setPipelineFactory(new SocketIOChannelInitializer() {

            @Override
            protected void initChannel(Channel ch) throws Exception {
                super.initChannel(ch);

                ch.pipeline().addAfter(HTTP_ENCODER, HealthCheckHandler.NAME, new HealthCheckHandler());
            }
        });

        return socketIOServer;
    }

    @Bean
    public SpringAnnotationScanner socketIOSpringAnnotationScanner(SocketIOServer server) {
        return new SpringAnnotationScanner(server);
    }

    private JsonSupport jsonSupport() {
        ObjectMapper timelineObjectMapper = objectMapper();
        JacksonJsonSupport jsonSupport = new JacksonJsonSupport() {
            @Override
            protected void init(ObjectMapper defaultObjectMapper) {
                super.init(timelineObjectMapper);
            }
        };

        // Hacky but we have no choice, we need to supply our custom configured ObjectMapper so that the messages
        // are serialized/deserialized the way we want to and the current java SocketIO implementation doesn't allow to
        // do it in the humane manner
        Field socketIOObjectMapper = ReflectionUtils.findField(JacksonJsonSupport.class, "objectMapper");

        socketIOObjectMapper.setAccessible(true);

        ReflectionUtils.setField(
                socketIOObjectMapper,
                jsonSupport,
                timelineObjectMapper
        );

        return jsonSupport;
    }

    private ObjectMapper objectMapper() {
        return ObjectMapperFactory.getInstance();
    }

    private static class HealthCheckHandler extends ChannelInboundHandlerAdapter {
        private static final String NAME = "healthCheck";

        @Override
        public void channelRead(ChannelHandlerContext context, Object message) throws Exception {
            if (isHealthCheckRequest(message)) {
                HttpResponse healthyResponse = new DefaultFullHttpResponse(
                        HTTP_1_1,
                        HttpResponseStatus.OK,
                        Unpooled.copiedBuffer(new ObjectMapper().writeValueAsString(new Healthy()), Charset.defaultCharset())
                );
                context.writeAndFlush(healthyResponse).addListener(ChannelFutureListener.CLOSE);
            } else {
                context.fireChannelRead(message);
            }
        }

        private boolean isHealthCheckRequest(Object msg) {
            return msg instanceof FullHttpRequest && ((FullHttpRequest) msg).uri().endsWith("/health");
        }

        private static class Healthy {
            public String getStatus() {
                return "UP";
            }
        }
    }
}

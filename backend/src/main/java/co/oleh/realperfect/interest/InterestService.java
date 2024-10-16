package co.oleh.realperfect.interest;

import co.oleh.realperfect.mapping.InterestDto;
import co.oleh.realperfect.mapping.MyInterestDto;
import co.oleh.realperfect.mapping.mappers.MappingService;
import co.oleh.realperfect.model.Interest;
import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.user.User;
import co.oleh.realperfect.repository.InterestRepository;
import co.oleh.realperfect.repository.RealtyObjectCrudRepository;
import co.oleh.realperfect.repository.UserRepository;
import co.oleh.realperfect.socket.model.Room;
import co.oleh.realperfect.socket.model.SocketEvent;
import com.corundumstudio.socketio.SocketIOServer;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class InterestService {
    private UserRepository userRepository;
    private RealtyObjectCrudRepository realtyObjectRepository;
    private InterestRepository interestRepository;
    private SocketIOServer server;
    private MappingService mappingService;


    public Interest save(InterestDto interestDto) {
        server.getRoomOperations(Room.POST_ROOM.name()).sendEvent(SocketEvent.LOAD_POST_PAGE.name(), interestDto);
        Interest interest = this.mappingService.map(interestDto, Interest.class);

        User user = this.userRepository.findById(interestDto.getUserId()).get();
        RealtyObject realtyObject = this.realtyObjectRepository.findById(interestDto.getRealtyObjId()).get();

        interest.setUser(user);
        interest.setRealtyObj(realtyObject);

        return interestRepository.save(interest);
    }

    public InterestDto remove(InterestDto interest) {
        interestRepository.deleteById(interest.getId());
        return interest;
    }

    public InterestDto findInterestForUserAndObject(Long userId, Long objectId) {
        Interest interest = interestRepository.findByUserIdAndRealtyObjId(userId, objectId);
        return this.mappingService.map(interest, InterestDto.class);
    }

    public List<MyInterestDto> findInterestsForUser(Long userId) {
        List<Interest> interests = interestRepository.findByUserId(userId);
        return interests.stream().map(i -> this.mappingService.map(i, MyInterestDto.class)).collect(Collectors.toList());
    }
}

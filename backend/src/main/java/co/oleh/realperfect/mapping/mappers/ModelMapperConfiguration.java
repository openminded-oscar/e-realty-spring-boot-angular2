package co.oleh.realperfect.mapping.mappers;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@AllArgsConstructor
@Configuration
public class ModelMapperConfiguration {
    private RoleToStringDto roleToStringDtoMapper;
    private UserToRealtyOwnerDtoMapper userToRealtyOwnerDtoMapper;

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addConverter(userToRealtyOwnerDtoMapper);
        modelMapper.addConverter(roleToStringDtoMapper);

        modelMapper.getConfiguration()
                .setPropertyCondition(ctx -> ctx.getSource() != null);

        return modelMapper;
    }
}
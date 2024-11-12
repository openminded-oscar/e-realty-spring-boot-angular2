package co.oleh.realperfect.mapping.mappers;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@AllArgsConstructor
@Configuration
public class ModelMapperConfiguration {
    private AddressDtoToAddressMapper addressDtoToAddressMapper;
    private AddressToAddressDtoMapper addressToAddressDtoMapper;
    private RoleToStringDtoMapper roleToStringDtoMapper;
    private UserToRealtyOwnerDtoMapper userToRealtyOwnerDtoMapper;

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.addConverter(userToRealtyOwnerDtoMapper);
        modelMapper.addConverter(roleToStringDtoMapper);
        modelMapper.addConverter(addressToAddressDtoMapper);
        modelMapper.addConverter(addressDtoToAddressMapper);

        modelMapper.getConfiguration()
                .setPropertyCondition(ctx -> ctx.getSource() != null);

        return modelMapper;
    }
}
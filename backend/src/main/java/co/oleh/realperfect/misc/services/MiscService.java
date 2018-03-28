package co.oleh.realperfect.misc.services;

import java.util.Arrays;
import java.util.List;

import co.oleh.realperfect.model.Region;
import org.springframework.stereotype.Service;

@Service
public class MiscService {
	public List<Region> getAllRegions() {
		return Arrays.asList(Region.values());	
	}
}

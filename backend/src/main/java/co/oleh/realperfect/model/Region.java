package co.oleh.realperfect.model;

import java.util.Arrays;
import java.util.Set;
import java.util.TreeSet;

/**
 * TODO move hardcoded districts to property files
 */
public enum Region {
	VINNYTSYA(new TreeSet<>(Arrays.asList(new String[]{"Tulchyn", "Zhmerynka"}))), 
	VOLYN(new TreeSet<>(Arrays.asList(new String[]{}))), 
	DNIPRO(new TreeSet<>(Arrays.asList(new String[]{}))),
	DONETSK(new TreeSet<>(Arrays.asList(new String[]{}))),
	ZHYTOMYR(new TreeSet<>(Arrays.asList(new String[]{}))), 
	ZAKARPATTYA(new TreeSet<>(Arrays.asList(new String[]{}))),
	ZAPORIZHZHYA(new TreeSet<>(Arrays.asList(new String[]{}))),
	IVANO_FRANKIVSK(new TreeSet<>(Arrays.asList(new String[]{}))),
	KYIV(new TreeSet<>(Arrays.asList(new String[]{}))),
	KROPYVNYTSKYY(new TreeSet<>(Arrays.asList(new String[]{}))),
	KRYM(new TreeSet<>(Arrays.asList(new String[]{}))),
	LVIV(new TreeSet<>(Arrays.asList(new String[]{"Drohobytch", "Mykolayiv", "Stryy"}))),
	LUHANSK(new TreeSet<>(Arrays.asList(new String[]{}))),
	MYKOLAYIV(new TreeSet<>(Arrays.asList(new String[]{}))),
	ODESA(new TreeSet<>(Arrays.asList(new String[]{}))), 
	RIVNE(new TreeSet<>(Arrays.asList(new String[]{}))),
	SUMY(new TreeSet<>(Arrays.asList(new String[]{}))),
	TERNOPIL(new TreeSet<>(Arrays.asList(new String[]{}))),
	HARKIV(new TreeSet<>(Arrays.asList(new String[]{}))),
	HMELNYTSKYY(new TreeSet<>(Arrays.asList(new String[]{}))),
	CHERKASY(new TreeSet<>(Arrays.asList(new String[]{}))),
	CHERNIHIV(new TreeSet<>(Arrays.asList(new String[]{}))),
	CHERNIVTSI(new TreeSet<>(Arrays.asList(new String[]{})));	
	
	private Set<String> districts;
	
	private Region(Set<String> districts) {
		this.districts = districts;
	}

	public Set<String> getDistricts() {
		return districts;
	}

	public void setDistricts(Set<String> districts) {
		this.districts = districts;
	}
}

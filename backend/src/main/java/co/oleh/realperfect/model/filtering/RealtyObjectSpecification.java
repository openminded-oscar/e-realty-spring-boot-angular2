package co.oleh.realperfect.model.filtering;

import java.math.BigDecimal;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import co.oleh.realperfect.model.RealtyObject;
import co.oleh.realperfect.model.RealtyObject_;

public class RealtyObjectSpecification implements Specification<RealtyObject> {

	private final RealtyObjectsFilter criteria;

	public RealtyObjectSpecification(RealtyObjectsFilter criteria) {
        this.criteria=criteria;
    }

	@Override
	public Predicate toPredicate(Root<RealtyObject> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
		BigDecimal maxPrice = criteria.getMaxPrice();
		BigDecimal minPrice = criteria.getMinPrice();
		Integer rooms = criteria.getRooms();
		
		
		Predicate predicate = cb.conjunction();
		
		if(maxPrice!=null){
			predicate = cb.and(predicate, cb.le(root.get(RealtyObject_.price), maxPrice));
		}
		
		if(minPrice!=null){
			predicate = cb.and(predicate, cb.ge(root.get(RealtyObject_.price), minPrice));
		}
		
		if(rooms!=null){
			predicate = cb.and(predicate, cb.equal(root.get(RealtyObject_.roomsAmount), rooms));
		}

		return predicate;
	}
}
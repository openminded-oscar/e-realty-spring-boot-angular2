package co.oleh.realperfect.model;

import java.math.BigDecimal;

import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@StaticMetamodel(RealtyObject.class)
public class RealtyObject_ {
    public static volatile SingularAttribute<RealtyObject, Long> id;
    public static volatile SingularAttribute<RealtyObject, BigDecimal> price;
    public static volatile SingularAttribute<RealtyObject, BigDecimal> roomsAmount;
}

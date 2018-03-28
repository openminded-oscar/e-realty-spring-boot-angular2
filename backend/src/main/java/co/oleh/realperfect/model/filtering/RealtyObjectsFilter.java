package co.oleh.realperfect.model.filtering;

import java.math.BigDecimal;

public class RealtyObjectsFilter {
	private Integer limit;
	private Integer offset;
	private Integer rooms;
	private BigDecimal minPrice;
	private BigDecimal maxPrice;

	public BigDecimal getMinPrice() {
		return minPrice;
	}

	public void setMinPrice(BigDecimal minPrice) {
		this.minPrice = minPrice;
	}

	public BigDecimal getMaxPrice() {
		return maxPrice;
	}

	public void setMaxPrice(BigDecimal maxPrice) {
		this.maxPrice = maxPrice;
	}

	public Integer getLimit() {
		return limit;
	}

	public void setLimit(Integer limit) {
		this.limit = limit;
	}

	public Integer getOffset() {
		return offset;
	}

	public void setOffset(Integer offset) {
		this.offset = offset;
	}

	public Integer getRooms() {
		return rooms;
	}

	public void setRooms(Integer rooms) {
		this.rooms = rooms;
	}

	@Override
	public String toString() {
		return "ObjectsFilter [limit=" + limit + ", offset=" + offset + "]";
	}
}
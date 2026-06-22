package co.oleh.realperfect.realty.perf;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * With {@code hibernate.default_batch_fetch_size=25}: the per-row association selects collapse into
 * a handful of batched {@code IN (...)} queries, so one full page costs a small constant number of
 * statements regardless of page size — and it stays compatible with pagination (no HHH000104).
 */
@TestPropertySource(properties = "spring.jpa.properties.hibernate.default_batch_fetch_size=25")
class RealtyListingWithBatchFetchTest extends AbstractRealtyListingQueryCountTest {

    @Test
    void batchFetchCollapsesListingIntoFewStatements() {
        long statements = measureListingStatements();

        System.out.printf("[N+1 perf] WITH batch fetch=25: %d JDBC statements for a page of %d objects%n",
                statements, PAGE_SIZE);

        // Main query + count + a bounded number of batched IN-loads, not one-per-row.
        assertThat(statements).isLessThan(PAGE_SIZE);
    }
}

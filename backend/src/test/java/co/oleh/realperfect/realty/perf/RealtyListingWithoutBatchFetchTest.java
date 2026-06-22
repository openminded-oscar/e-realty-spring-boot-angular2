package co.oleh.realperfect.realty.perf;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Baseline: no {@code hibernate.default_batch_fetch_size}. Demonstrates the N+1 — each listed row
 * triggers extra per-row selects for its lazy/eager associations, so the statement count grows with
 * the page size (well above one query per row).
 */
class RealtyListingWithoutBatchFetchTest extends AbstractRealtyListingQueryCountTest {

    @Test
    void listingWithoutBatchFetchIssuesManyStatements() {
        long statements = measureListingStatements();

        System.out.printf("[N+1 perf] WITHOUT batch fetch: %d JDBC statements for a page of %d objects%n",
                statements, PAGE_SIZE);

        // N+1 present: far more than one statement per listed row.
        assertThat(statements).isGreaterThan(PAGE_SIZE);
    }
}

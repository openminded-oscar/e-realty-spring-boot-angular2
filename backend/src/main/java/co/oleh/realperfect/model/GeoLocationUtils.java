package co.oleh.realperfect.model;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.WKTWriter;

import java.util.ArrayList;
import java.util.List;

public class GeoLocationUtils {
    public static final int MIN_ZOOM_LEVEL_TO_SEARCH = 5;
    public static final int ZOOM_LEVEL_FOR_AUTOGENERATE = 8;
    private static final GeometryFactory geometryFactory = new GeometryFactory();

    /**
     * Converts latitude and longitude (doubles) to a JTS Point object.
     *
     * @param lon the longitude
     * @param lat the latitude
     * @return a Point object representing the geographical coordinates
     */
    public static Point lonLatToPoint(double lon, double lat) {
        Coordinate coordinate = new Coordinate(lon, lat);
        return geometryFactory.createPoint(coordinate);
    }

    public static String pointToWkt(Point point) {
        if (point == null) {
            return null;
        }

        // Use WKTWriter to convert the Point to its WKT representation
        WKTWriter writer = new WKTWriter();
        return writer.write(point);
    }

    public static String coordinatesToWkt(double lon, double lat) {
        return pointToWkt(lonLatToPoint(lon, lat));
    }

    public static int zoomLevelToRadiusMeters(int zoomLevel) {
        return switch (zoomLevel) {
            case 0 -> 20000000;
            case 1 -> 10000000;
            case 2 -> 5000000;
            case 3 -> 2500000;
            case 4 -> 1250000;
            case 5 -> 600000;
            case 6 -> 300000;
            case 7 -> 150000;
            case 8 -> 75000;
            case 9 -> 38000;
            case 10 -> 19000;
            case 11 -> 9500;
            case 12 -> 4800;
            case 13 -> 2400;
            case 14 -> 1200;
            case 15 -> 600;
            case 16 -> 300;
            case 17 -> 150;
            case 18 -> 75;
            case 19 -> 38;
            case 20 -> 19;
            default -> 50_000;
        };
    }

    public static List<GeoSegment> generateGeoSegmentsForUkraine(int numRows, int numCols) {
        List<GeoSegment> geoSegments = new ArrayList<>();
        double minLat = 44.0;  // Southern boundary
        double maxLat = 52.0;  // Northern boundary
        double minLon = 22.0;  // Western boundary
        double maxLon = 40.0;  // Eastern boundary

        double latStep = (maxLat - minLat) / (numRows - 1);
        double lonStep = (maxLon - minLon) / (numCols - 1);

        for (int i = 0; i < numRows; i++) {
            for (int j = 0; j < numCols; j++) {
                double latitude = minLat + i * latStep;
                double longitude = minLon + j * lonStep;
                geoSegments.add(new GeoSegment(longitude, latitude));
            }
        }

        return geoSegments;
    }

    public static List<GeoSegment> generateRegionalCentersForUkraine() {
        List<GeoSegment> geoSegments = new ArrayList<>();

        // Coordinates of regional centers in Ukraine (latitude, longitude)
        geoSegments.add(new GeoSegment(30.5234, 50.4501)); // Kyiv
        geoSegments.add(new GeoSegment(30.7181, 46.4825)); // Odesa
        geoSegments.add(new GeoSegment(36.2304, 49.9935)); // Kharkiv
        geoSegments.add(new GeoSegment(35.0462, 48.4647)); // Dnipro
        geoSegments.add(new GeoSegment(24.0297, 49.8397)); // Lviv
        geoSegments.add(new GeoSegment(28.4826, 49.2328)); // Vinnytsia
        geoSegments.add(new GeoSegment(28.6587, 50.2547)); // Zhytomyr
        geoSegments.add(new GeoSegment(25.9403, 48.2915)); // Chernivtsi
        geoSegments.add(new GeoSegment(35.1318, 47.8388)); // Zaporizhzhia
        geoSegments.add(new GeoSegment(37.6187, 47.0971)); // Donetsk
        geoSegments.add(new GeoSegment(32.6169, 46.6354)); // Kherson
        geoSegments.add(new GeoSegment(32.0621, 49.4229)); // Cherkasy
        geoSegments.add(new GeoSegment(32.2623, 48.5079)); // Kropyvnytskyi
        geoSegments.add(new GeoSegment(26.2516, 50.6199)); // Rivne
        geoSegments.add(new GeoSegment(34.5514, 49.5883)); // Poltava
        geoSegments.add(new GeoSegment(31.8906, 46.9750)); // Mykolaiv
        geoSegments.add(new GeoSegment(26.9794, 49.4197)); // Khmelnytskyi
        geoSegments.add(new GeoSegment(39.3495, 48.5735)); // Luhansk
        geoSegments.add(new GeoSegment(33.4729, 47.8131)); // Kryvyi Rih (though not an oblast capital, it's a major city)
        geoSegments.add(new GeoSegment(25.3429, 50.7472)); // Lutsk
        geoSegments.add(new GeoSegment(24.7097, 48.9226)); // Ivano-Frankivsk
        geoSegments.add(new GeoSegment(31.2849, 51.4982)); // Chernihiv
        geoSegments.add(new GeoSegment(22.2947, 48.6210)); // Uzhhorod
        geoSegments.add(new GeoSegment(34.8021, 50.9077)); // Sumy
        geoSegments.add(new GeoSegment(25.5934, 49.5535)); // Ternopil

        return geoSegments;
    }

    public static double calculateDistanceSquared(double lat, double lng, GeoSegment segment) {
        double latDiff = lat - segment.getCenterLatitude();
        double lngDiff = lng - segment.getCenterLongitude();
        return Math.pow(latDiff, 2) + Math.pow(lngDiff, 2);
    }
}
package co.oleh.realperfect.model;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.WKTWriter;

public class AddressUtils {
    public static final int MIN_ZOOM_LEVEL_TO_SEARCH = 5;
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
}
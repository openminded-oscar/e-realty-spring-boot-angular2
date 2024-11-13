package co.oleh.realperfect.model;

import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.WKTWriter;

public class AddressUtils {
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
}
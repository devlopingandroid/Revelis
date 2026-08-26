import { CONFIG } from '../config/env';
import { LocationData } from '../types/location';
import { GeofenceEvaluation, Place, PlaceCoordinates, ZoneStatus } from '../types/place';

/**
 * Geographic Utility & Service
 * Handles geodesic distance calculations (Haversine formula) and
 * evaluates place discovery zone boundaries with GPS accuracy guardrails.
 */
export class GeoService {
  private readonly EARTH_RADIUS_METERS = 6371000; // Earth mean radius in meters

  /**
   * Calculate exact distance in meters between two geographical coordinates
   * using the Haversine formula.
   */
  public calculateDistanceMeters(
    coord1: PlaceCoordinates,
    coord2: PlaceCoordinates
  ): number {
    const lat1Rad = this.toRadians(coord1.latitude);
    const lat2Rad = this.toRadians(coord2.latitude);
    const deltaLatRad = this.toRadians(coord2.latitude - coord1.latitude);
    const deltaLonRad = this.toRadians(coord2.longitude - coord1.longitude);

    const a =
      Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(deltaLonRad / 2) *
        Math.sin(deltaLonRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(this.EARTH_RADIUS_METERS * c * 10) / 10; // Round to 1 decimal place
  }

  /**
   * Evaluate user's proximity to a target Place and determine Discovery Zone status.
   * Incorporates GPS accuracy guardrails.
   */
  public evaluateProximity(
    userLocation: LocationData | null,
    place: Place
  ): GeofenceEvaluation {
    if (!userLocation) {
      return {
        place,
        distanceMeters: null,
        formattedDistance: 'Waiting for GPS...',
        isInsideZone: false,
        zoneStatus: 'NO_GPS_FIX',
        accuracyMeters: null,
        accuracyWarning: 'Waiting for initial GPS location fix...',
      };
    }

    const userCoord: PlaceCoordinates = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    };

    const distanceMeters = this.calculateDistanceMeters(userCoord, place.location);
    const accuracyMeters = userLocation.accuracy;

    const formattedDistance = this.formatDistance(distanceMeters);

    // 1. Evaluate GPS Accuracy Guardrail
    // If accuracy is missing or exceeds threshold (50 meters or radius boundary), flag LOW_ACCURACY
    const isAccuracyPoor =
      accuracyMeters === null ||
      accuracyMeters > CONFIG.LOCATION.ACCURACY_THRESHOLD_METERS ||
      (accuracyMeters > place.radiusMeters && distanceMeters <= place.radiusMeters * 2);

    if (isAccuracyPoor) {
      const accVal = accuracyMeters ? `±${Math.round(accuracyMeters)}m` : 'Unknown';
      return {
        place,
        distanceMeters,
        formattedDistance,
        isInsideZone: false,
        zoneStatus: 'LOW_ACCURACY',
        accuracyMeters,
        accuracyWarning: `GPS signal accuracy (${accVal}) is too imprecise to confirm zone entry. Requires < 50m accuracy fix.`,
      };
    }

    // 2. Evaluate Discovery Zone Boundary (Inside vs Outside)
    const isInside = distanceMeters <= place.radiusMeters;
    const zoneStatus: ZoneStatus = isInside ? 'INSIDE' : 'OUTSIDE';

    return {
      place,
      distanceMeters,
      formattedDistance,
      isInsideZone: isInside,
      zoneStatus,
      accuracyMeters,
    };
  }

  /**
   * Format distance in meters into readable string (e.g., "85 m" or "2.4 km").
   */
  public formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    const km = meters / 1000;
    return `${km.toFixed(2)} km`;
  }

  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}

// Export singleton instance
export const geoService = new GeoService();

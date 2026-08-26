/**
 * Place & Geofencing Types for Revelis AI Tourism App
 */

export interface PlaceCoordinates {
  latitude: number;
  longitude: number;
}

export type PlaceCategory = 'monument' | 'heritage' | 'nature' | 'museum' | 'cultural';

export interface Place {
  id: string;
  name: string;
  subtitle?: string;
  shortDescription: string;
  description?: string;
  category: PlaceCategory;
  location: PlaceCoordinates;
  /**
   * Radius in meters defining the discovery zone threshold (e.g. 150m or 200m)
   */
  radiusMeters: number;
  imageUrl?: string;
}

/**
 * Status of traveller relative to a tourist location's discovery zone
 */
export type ZoneStatus =
  | 'INSIDE'         // Distance <= radius & accuracy is reliable
  | 'OUTSIDE'        // Distance > radius & accuracy is reliable
  | 'LOW_ACCURACY'   // GPS accuracy is too poor (> threshold) to confidently confirm status
  | 'NO_GPS_FIX';    // No GPS coordinates available yet

export interface GeofenceEvaluation {
  place: Place;
  /**
   * Distance between user's current GPS location and place in meters
   */
  distanceMeters: number | null;
  /**
   * Formatted distance string for display (e.g. "145 m" or "2.4 km")
   */
  formattedDistance: string;
  /**
   * Boolean flag indicating whether user is within radius (only true when accuracy is reliable)
   */
  isInsideZone: boolean;
  /**
   * Zone status category
   */
  zoneStatus: ZoneStatus;
  /**
   * Current GPS accuracy in meters
   */
  accuracyMeters: number | null;
  /**
   * Informative warning message if accuracy is low or GPS fix is absent
   */
  accuracyWarning?: string;
}

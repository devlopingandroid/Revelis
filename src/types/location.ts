import * as Location from 'expo-location';

/**
 * Standardized Location Data model returned by Revelis Location Service
 */
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number;
}

/**
 * Status states for foreground GPS tracking lifecycle
 */
export type TrackingStatus =
  | 'IDLE'                   // Service initialized, tracking paused
  | 'CHECKING_PERMISSIONS'   // Verifying foreground permission status
  | 'REQUESTING_PERMISSION'  // Displaying permission prompt to user
  | 'PERMISSION_DENIED'      // User denied location permission
  | 'GPS_DISABLED'          // Location services turned off in system settings
  | 'TRACKING'               // Actively receiving GPS location updates
  | 'ERROR';                 // Unexpected system or hardware error

/**
 * Detailed error state for UI display and diagnostics
 */
export interface LocationErrorState {
  code: 'PERMISSION_DENIED' | 'GPS_DISABLED' | 'POSITION_UNAVAILABLE' | 'SUBSCRIPTION_ERROR' | 'UNKNOWN';
  message: string;
  details?: string;
}

/**
 * Accuracy level metadata for UI badge rendering
 */
export type AccuracyLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';

export interface LocationSubscriptionOptions {
  accuracy?: Location.Accuracy;
  timeInterval?: number;
  distanceInterval?: number;
}

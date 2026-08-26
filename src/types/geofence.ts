import * as Location from 'expo-location';

/**
 * Geofence Event Type ('ENTER' | 'EXIT' | 'NONE')
 */
export type GeofenceEventType = 'ENTER' | 'EXIT' | 'NONE';

/**
 * Record of a background geofence event saved in persistent storage
 */
export interface GeofenceEventRecord {
  id: string;
  eventType: GeofenceEventType;
  regionId: string;
  placeName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  timestamp: number;
}

/**
 * Current background geofence state for UI debugging
 */
export interface GeofenceState {
  isRegistered: boolean;
  activeRegionId: string | null;
  currentZoneStatus: 'INSIDE' | 'OUTSIDE' | 'UNKNOWN';
  lastEvent: GeofenceEventRecord | null;
  backgroundPermissionGranted: boolean;
}

/**
 * Task name identifier for expo-task-manager
 */
export const GEOFENCE_TASK_NAME = 'REVELIS_BACKGROUND_GEOFENCE_TASK';

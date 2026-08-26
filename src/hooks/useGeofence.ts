import { useMemo } from 'react';
import { geoService } from '../services/GeoService';
import { LocationData } from '../types/location';
import { GeofenceEvaluation, Place } from '../types/place';

/**
 * Reusable React Hook for Geofence Proximity Detection
 * 
 * Re-evaluates distance and discovery zone status whenever user location updates.
 */
export function useGeofence(
  userLocation: LocationData | null,
  targetPlace: Place
): GeofenceEvaluation {
  return useMemo(() => {
    return geoService.evaluateProximity(userLocation, targetPlace);
  }, [userLocation, targetPlace]);
}

import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { HERITAGE_PLACES } from '../data/places';
import { locationService } from '../services/LocationService';
import { storageService } from '../services/StorageService';
import { GeofenceEventRecord } from '../types/geofence';
import { Place } from '../types/place';

export function useBackgroundGeofence(targetPlaces: Place[] = HERITAGE_PLACES) {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<GeofenceEventRecord | null>(null);
  const [backgroundPermission, setBackgroundPermission] = useState<Location.PermissionStatus | null>(null);

  const isMounted = useRef<boolean>(true);

  // Check registration status and load last event from storage
  const refreshGeofenceStatus = useCallback(async () => {
    try {
      const active = await locationService.isGeofenceActive();
      const lastRec = await storageService.getLastGeofenceEvent();
      const bgPermRes = await locationService.checkBackgroundPermissions();

      if (isMounted.current) {
        setIsRegistered(active);
        setLastEvent(lastRec);
        setBackgroundPermission(bgPermRes.status);
      }
    } catch (err) {
      console.error('[useBackgroundGeofence] Error refreshing status:', err);
    }
  }, []);

  // Register background geofence for target places
  const registerGeofence = useCallback(async () => {
    setIsRegistering(true);
    try {
      const success = await locationService.startGeofencing(targetPlaces);
      if (isMounted.current) {
        setIsRegistered(success);
        const bgPermRes = await locationService.checkBackgroundPermissions();
        setBackgroundPermission(bgPermRes.status);
      }
      return success;
    } catch (err) {
      console.error('[useBackgroundGeofence] Failed to register geofence:', err);
      return false;
    } finally {
      if (isMounted.current) setIsRegistering(false);
    }
  }, [targetPlaces]);

  // Unregister background geofence
  const unregisterGeofence = useCallback(async () => {
    setIsRegistering(true);
    try {
      const success = await locationService.stopGeofencing();
      if (isMounted.current) {
        setIsRegistered(!success ? isRegistered : false);
      }
      return success;
    } catch (err) {
      console.error('[useBackgroundGeofence] Failed to unregister geofence:', err);
      return false;
    } finally {
      if (isMounted.current) setIsRegistering(false);
    }
  }, [isRegistered]);

  // Clear event history
  const clearHistory = useCallback(async () => {
    await storageService.clearHistory();
    if (isMounted.current) setLastEvent(null);
  }, []);

  // Listen for background geofence event updates from StorageService
  useEffect(() => {
    isMounted.current = true;
    refreshGeofenceStatus();

    const unsubscribe = storageService.subscribe((newEvent) => {
      if (isMounted.current) {
        console.log('[useBackgroundGeofence] Real-time event update received:', newEvent);
        setLastEvent(newEvent);
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, [refreshGeofenceStatus]);

  return {
    isRegistered,
    isRegistering,
    lastEvent,
    backgroundPermission,
    registerGeofence,
    unregisterGeofence,
    clearHistory,
    refreshGeofenceStatus,
  };
}

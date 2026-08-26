import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DELHI_PLACES } from '../data/places';
import { geofenceManager } from '../services/GeofenceManager';
import { geoService } from '../services/GeoService';
import { placeRepository } from '../services/PlaceRepository';
import { storageService } from '../services/StorageService';
import { GeofenceEventRecord } from '../types/geofence';
import { LocationData } from '../types/location';
import { GeofenceEvaluation, Place } from '../types/place';

export function useMultiPlaceGeofence(userLocation: LocationData | null) {
  const [allPlaces, setAllPlaces] = useState<Place[]>(DELHI_PLACES);
  const [selectedPlace, setSelectedPlace] = useState<Place>(DELHI_PLACES[0]);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [lastEvent, setLastEvent] = useState<GeofenceEventRecord | null>(null);

  const isMounted = useRef<boolean>(true);

  // Fetch initial place list
  useEffect(() => {
    isMounted.current = true;
    placeRepository.getAllPlaces().then((places) => {
      if (isMounted.current && places.length > 0) {
        setAllPlaces(places);
      }
    });

    geofenceManager.isGeofencingActive().then((active) => {
      if (isMounted.current) setIsRegistered(active);
    });

    storageService.getLastGeofenceEvent().then((rec) => {
      if (isMounted.current) setLastEvent(rec);
    });

    const unsubscribe = storageService.subscribe((newEvent) => {
      if (isMounted.current) {
        setLastEvent(newEvent);
      }
    });

    return () => {
      isMounted.current = false;
      unsubscribe();
    };
  }, []);

  // Compute geofence evaluation for selected place
  const selectedEvaluation: GeofenceEvaluation = useMemo(() => {
    return geoService.evaluateProximity(userLocation, selectedPlace);
  }, [userLocation, selectedPlace]);

  // Compute nearest place and its evaluation
  const nearestEvaluation: GeofenceEvaluation | null = useMemo(() => {
    return geofenceManager.evaluateNearestPlaceProximity(userLocation);
  }, [userLocation]);

  // Register multi-place geofences
  const registerAllGeofences = useCallback(async () => {
    setIsRegistering(true);
    try {
      const success = await geofenceManager.registerAllGeofences();
      if (isMounted.current) setIsRegistered(success);
      return success;
    } catch (err) {
      console.error('[useMultiPlaceGeofence] Registration failed:', err);
      return false;
    } finally {
      if (isMounted.current) setIsRegistering(false);
    }
  }, []);

  // Unregister multi-place geofences
  const unregisterAllGeofences = useCallback(async () => {
    setIsRegistering(true);
    try {
      const success = await geofenceManager.unregisterAllGeofences();
      if (isMounted.current && success) setIsRegistered(false);
      return success;
    } catch (err) {
      console.error('[useMultiPlaceGeofence] Unregistration failed:', err);
      return false;
    } finally {
      if (isMounted.current) setIsRegistering(false);
    }
  }, []);

  // Clear event history log
  const clearHistory = useCallback(async () => {
    await storageService.clearHistory();
    if (isMounted.current) setLastEvent(null);
  }, []);

  return {
    allPlaces,
    selectedPlace,
    setSelectedPlace,
    selectedEvaluation,
    nearestEvaluation,
    isRegistered,
    isRegistering,
    lastEvent,
    registerAllGeofences,
    unregisterAllGeofences,
    clearHistory,
  };
}

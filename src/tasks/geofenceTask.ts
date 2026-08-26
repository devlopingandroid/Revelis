import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { placeRepository } from '../services/PlaceRepository';
import { storageService } from '../services/StorageService';
import {
  GEOFENCE_TASK_NAME,
  GeofenceEventRecord,
  GeofenceEventType,
} from '../types/geofence';

/**
 * Multi-Place Background Geofence Task Definition
 * 
 * Executed by Android native location service when traveller enters or exits
 * any registered heritage spot radius (India Gate, Red Fort, Qutub Minar, etc.).
 */
TaskManager.defineTask(GEOFENCE_TASK_NAME, async ({ data, error }: any) => {
  if (error) {
    console.error(`[MultiGeofenceTask] Task error: ${error.message}`);
    return;
  }

  if (!data) {
    console.warn('[MultiGeofenceTask] Received empty data payload');
    return;
  }

  const { eventType: rawEventType, region } = data;

  if (!region) {
    console.warn('[MultiGeofenceTask] No region info in geofence event payload');
    return;
  }

  // Map Expo GeofencingEventType enum to string ('ENTER' | 'EXIT')
  const eventType: GeofenceEventType =
    rawEventType === Location.GeofencingEventType.Enter
      ? 'ENTER'
      : rawEventType === Location.GeofencingEventType.Exit
      ? 'EXIT'
      : 'NONE';

  if (eventType === 'NONE') {
    console.log(`[MultiGeofenceTask] Ignored unknown event type: ${rawEventType}`);
    return;
  }

  const regionId = region.identifier;
  
  // Resolve Place object from PlaceRepository
  const place = await placeRepository.getPlaceById(regionId);
  const placeName = place ? place.name : regionId || 'Unknown Heritage Site';
  const radiusMeters = place ? place.radiusMeters : region.radius || 150;
  const latitude = place ? place.location.latitude : region.latitude || 0;
  const longitude = place ? place.location.longitude : region.longitude || 0;

  console.log(
    `[MultiGeofenceTask] GEOFENCE EVENT TRIGGERED: ${eventType} at '${placeName}' (${regionId})`
  );

  // Deduplication Guardrail: Prevent repeated duplicate triggers for the same place & event state
  const lastEvent = await storageService.getLastGeofenceEvent();
  if (lastEvent) {
    const isSameRegion = lastEvent.regionId === regionId;
    const isSameType = lastEvent.eventType === eventType;
    const timeDelta = Date.now() - lastEvent.timestamp;

    // Ignore duplicate event if identical state received for same place within 15 seconds
    if (isSameRegion && isSameType && timeDelta < 15000) {
      console.log(
        `[MultiGeofenceTask] Suppressed duplicate '${eventType}' trigger for ${placeName} (delta: ${Math.round(timeDelta / 1000)}s)`
      );
      return;
    }
  }

  // Construct geofence event record
  const record: GeofenceEventRecord = {
    id: `${regionId}_${eventType}_${Date.now()}`,
    eventType,
    regionId: regionId || 'unknown',
    placeName,
    latitude,
    longitude,
    radiusMeters,
    timestamp: Date.now(),
  };

  // Persist event record in storage & notify active UI listeners
  await storageService.saveGeofenceEvent(record);
});

console.log(`[MultiGeofenceTask] Task '${GEOFENCE_TASK_NAME}' active with multi-place resolution.`);

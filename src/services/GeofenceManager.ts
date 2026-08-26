import { GeofenceEvaluation, Place } from '../types/place';
import { LocationData } from '../types/location';
import { geoService } from './GeoService';
import { locationService } from './LocationService';
import { placeRepository } from './PlaceRepository';

/**
 * GeofenceManager
 * 
 * Reusable coordinator service managing registration of multiple tourist geofences,
 * place lookup resolution, and proximity evaluation.
 */
export class GeofenceManager {
  /**
   * Register geofences for all available heritage locations in PlaceRepository.
   */
  public async registerAllGeofences(): Promise<boolean> {
    const places = await placeRepository.getAllPlaces();
    console.log(`[GeofenceManager] Registering ${places.length} heritage geofences...`);
    return await locationService.startGeofencing(places);
  }

  /**
   * Stop active geofencing for all places.
   */
  public async unregisterAllGeofences(): Promise<boolean> {
    console.log('[GeofenceManager] Stopping all geofence registrations...');
    return await locationService.stopGeofencing();
  }

  /**
   * Check if the multi-place geofencing system is active.
   */
  public async isGeofencingActive(): Promise<boolean> {
    return await locationService.isGeofenceActive();
  }

  /**
   * Resolve a region identifier string (triggered by TaskManager) to its corresponding Place object.
   */
  public async resolvePlaceFromRegionId(regionId: string): Promise<Place | null> {
    const place = await placeRepository.getPlaceById(regionId);
    if (place) return place;

    console.warn(`[GeofenceManager] Region ID '${regionId}' not found in repository. Falling back to default.`);
    const places = await placeRepository.getAllPlaces();
    return places.length ? places[0] : null;
  }

  /**
   * Evaluate proximity for a target place ID.
   */
  public async evaluatePlaceProximity(
    userLocation: LocationData | null,
    placeId: string
  ): Promise<GeofenceEvaluation | null> {
    const place = await placeRepository.getPlaceById(placeId);
    if (!place) return null;
    return geoService.evaluateProximity(userLocation, place);
  }

  /**
   * Find nearest place to user's location and evaluate its geofence status.
   */
  public evaluateNearestPlaceProximity(
    userLocation: LocationData | null
  ): GeofenceEvaluation | null {
    if (!userLocation) return null;

    const nearest = placeRepository.findNearestPlace(userLocation);
    if (!nearest) return null;

    return geoService.evaluateProximity(userLocation, nearest.place);
  }
}

export const geofenceManager = new GeofenceManager();

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Linking, Platform } from 'react-native';
import { CONFIG } from '../config/env';
import { GEOFENCE_TASK_NAME } from '../types/geofence';
import {
  LocationData,
  LocationErrorState,
  LocationSubscriptionOptions,
} from '../types/location';
import { Place } from '../types/place';

/**
 * Reusable LocationService
 * 
 * Encapsulates foreground GPS tracking, system hardware state checks,
 * foreground & background permissions, and background geofencing via TaskManager.
 */
export class LocationService {
  private subscription: Location.LocationSubscription | null = null;

  /**
   * Check current foreground location permissions without prompting the user.
   */
  public async checkPermissions(): Promise<Location.PermissionResponse> {
    try {
      return await Location.getForegroundPermissionsAsync();
    } catch (error) {
      console.error('[LocationService] Failed to check foreground permissions:', error);
      throw error;
    }
  }

  /**
   * Prompt the user for foreground location permissions.
   */
  public async requestPermissions(): Promise<Location.PermissionResponse> {
    try {
      return await Location.requestForegroundPermissionsAsync();
    } catch (error) {
      console.error('[LocationService] Failed to request foreground permissions:', error);
      throw error;
    }
  }

  /**
   * Check background location permissions (Android 10+ / iOS Always).
   */
  public async checkBackgroundPermissions(): Promise<Location.PermissionResponse> {
    try {
      return await Location.getBackgroundPermissionsAsync();
    } catch (error) {
      console.error('[LocationService] Failed to check background permissions:', error);
      throw error;
    }
  }

  /**
   * Request background location permissions.
   * Note: On Android 10+, foreground permission MUST be granted first before requesting background access.
   */
  public async requestBackgroundPermissions(): Promise<Location.PermissionResponse> {
    try {
      // 1. Verify foreground permission first
      const fgPerm = await this.checkPermissions();
      if (fgPerm.status !== Location.PermissionStatus.GRANTED) {
        const fgReq = await this.requestPermissions();
        if (fgReq.status !== Location.PermissionStatus.GRANTED) {
          return fgReq;
        }
      }

      // 2. Request background permission
      return await Location.requestBackgroundPermissionsAsync();
    } catch (error) {
      console.error('[LocationService] Failed to request background permissions:', error);
      throw error;
    }
  }

  /**
   * Check if device location services (GPS) are enabled at the system level.
   */
  public async isGpsEnabled(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.error('[LocationService] Failed to check location services:', error);
      return false;
    }
  }

  /**
   * Fetch a single, one-time current location update.
   */
  public async getCurrentLocation(
    accuracy: Location.Accuracy = CONFIG.LOCATION.ACCURACY
  ): Promise<LocationData> {
    const isGpsOn = await this.isGpsEnabled();
    if (!isGpsOn) {
      throw {
        code: 'GPS_DISABLED',
        message: 'Location services are disabled on device system settings.',
      } as LocationErrorState;
    }

    const { status } = await this.checkPermissions();
    if (status !== Location.PermissionStatus.GRANTED) {
      throw {
        code: 'PERMISSION_DENIED',
        message: 'Foreground location permission not granted.',
      } as LocationErrorState;
    }

    try {
      const position = await Location.getCurrentPositionAsync({ accuracy });
      return this.formatLocationObject(position);
    } catch (error: any) {
      throw {
        code: 'POSITION_UNAVAILABLE',
        message: 'Unable to acquire current location fix from GPS.',
        details: error?.message || String(error),
      } as LocationErrorState;
    }
  }

  /**
   * Start live foreground location tracking using watchPositionAsync.
   */
  public async startForegroundTracking(
    onLocation: (location: LocationData) => void,
    onError: (error: LocationErrorState) => void,
    options: LocationSubscriptionOptions = {}
  ): Promise<void> {
    const isGpsOn = await this.isGpsEnabled();
    if (!isGpsOn) {
      onError({
        code: 'GPS_DISABLED',
        message: 'Location services (GPS) are disabled on your phone.',
      });
      return;
    }

    let permissionRes = await this.checkPermissions();
    if (permissionRes.status !== Location.PermissionStatus.GRANTED) {
      permissionRes = await this.requestPermissions();
      if (permissionRes.status !== Location.PermissionStatus.GRANTED) {
        onError({
          code: 'PERMISSION_DENIED',
          message: 'Location permission is required to track your physical position.',
        });
        return;
      }
    }

    await this.stopForegroundTracking();

    const watchOptions: Location.LocationOptions = {
      accuracy: options.accuracy ?? CONFIG.LOCATION.ACCURACY,
      timeInterval: options.timeInterval ?? CONFIG.LOCATION.TIME_INTERVAL,
      distanceInterval: options.distanceInterval ?? CONFIG.LOCATION.DISTANCE_FILTER_METERS,
    };

    try {
      console.log('[LocationService] Starting foreground tracking with options:', watchOptions);
      this.subscription = await Location.watchPositionAsync(watchOptions, (location) => {
        const formatted = this.formatLocationObject(location);
        onLocation(formatted);
      });
    } catch (error: any) {
      console.error('[LocationService] watchPositionAsync error:', error);
      onError({
        code: 'SUBSCRIPTION_ERROR',
        message: 'Failed to subscribe to location updates.',
        details: error?.message || String(error),
      });
    }
  }

  /**
   * Stop active foreground location tracking.
   */
  public async stopForegroundTracking(): Promise<void> {
    if (this.subscription) {
      console.log('[LocationService] Removing foreground tracking subscription');
      this.subscription.remove();
      this.subscription = null;
    }
  }

  /* =========================================================================
   * BACKGROUND GEOFENCING API (PHASE 3)
   * ========================================================================= */

  /**
   * Check if the background geofence task is registered in TaskManager and active.
   */
  public async isGeofenceActive(): Promise<boolean> {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(GEOFENCE_TASK_NAME);
      if (!isRegistered) return false;
      return await Location.hasStartedGeofencingAsync(GEOFENCE_TASK_NAME);
    } catch (error) {
      console.error('[LocationService] Error checking geofence active status:', error);
      return false;
    }
  }

  /**
   * Register background geofence region boundaries for an array of Places (e.g. India Gate).
   */
  public async startGeofencing(places: Place[]): Promise<boolean> {
    try {
      // 1. Verify background permission
      let bgPerm = await this.checkBackgroundPermissions();
      if (bgPerm.status !== Location.PermissionStatus.GRANTED) {
        bgPerm = await this.requestBackgroundPermissions();
        if (bgPerm.status !== Location.PermissionStatus.GRANTED) {
          console.warn('[LocationService] Background location permission not granted.');
          return false;
        }
      }

      // 2. Convert Places array to LocationRegion array
      const regions: Location.LocationRegion[] = places.map((place) => ({
        identifier: place.id,
        latitude: place.location.latitude,
        longitude: place.location.longitude,
        radius: place.radiusMeters,
        notifyOnEnter: true,
        notifyOnExit: true,
      }));

      console.log(`[LocationService] Registering background geofences for ${regions.length} places:`, regions);

      // 3. Start geofencing background task
      await Location.startGeofencingAsync(GEOFENCE_TASK_NAME, regions);
      return true;
    } catch (error) {
      console.error('[LocationService] Failed to start geofencing:', error);
      return false;
    }
  }

  /**
   * Unregister background geofences and stop TaskManager task.
   */
  public async stopGeofencing(): Promise<boolean> {
    try {
      const active = await this.isGeofenceActive();
      if (active) {
        console.log('[LocationService] Stopping background geofencing task...');
        await Location.stopGeofencingAsync(GEOFENCE_TASK_NAME);
      }
      return true;
    } catch (error) {
      console.error('[LocationService] Failed to stop geofencing:', error);
      return false;
    }
  }

  /**
   * Open system settings for manual permission management.
   */
  public async openSettings(): Promise<void> {
    try {
      if (Platform.OS === 'android') {
        await Linking.openSettings();
      } else {
        await Linking.openURL('app-settings:');
      }
    } catch (error) {
      console.error('[LocationService] Failed to open app settings:', error);
    }
  }

  private formatLocationObject(raw: Location.LocationObject): LocationData {
    return {
      latitude: raw.coords.latitude,
      longitude: raw.coords.longitude,
      accuracy: raw.coords.accuracy ?? null,
      altitude: raw.coords.altitude ?? null,
      altitudeAccuracy: raw.coords.altitudeAccuracy ?? null,
      heading: raw.coords.heading ?? null,
      speed: raw.coords.speed ?? null,
      timestamp: raw.timestamp,
    };
  }
}

export const locationService = new LocationService();

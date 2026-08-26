import { useCallback, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { locationService } from '../services/LocationService';
import {
  LocationData,
  LocationErrorState,
  TrackingStatus,
} from '../types/location';

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [status, setStatus] = useState<TrackingStatus>('IDLE');
  const [error, setError] = useState<LocationErrorState | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const [isGpsEnabled, setIsGpsEnabled] = useState<boolean>(true);

  const isMounted = useRef<boolean>(true);

  // Initialize permission check & GPS status check
  const checkStatus = useCallback(async () => {
    setStatus('CHECKING_PERMISSIONS');
    setError(null);

    try {
      const gpsEnabled = await locationService.isGpsEnabled();
      if (isMounted.current) setIsGpsEnabled(gpsEnabled);

      if (!gpsEnabled) {
        if (isMounted.current) {
          setStatus('GPS_DISABLED');
          setError({
            code: 'GPS_DISABLED',
            message: 'Device GPS is turned off. Please enable location in Quick Settings.',
          });
        }
        return false;
      }

      const permRes = await locationService.checkPermissions();
      const granted = permRes.status === Location.PermissionStatus.GRANTED;

      if (isMounted.current) {
        setPermissionGranted(granted);
        if (granted) {
          setStatus('IDLE');
        } else {
          setStatus('PERMISSION_DENIED');
        }
      }
      return granted;
    } catch (err: any) {
      if (isMounted.current) {
        setStatus('ERROR');
        setError({
          code: 'UNKNOWN',
          message: 'Failed to verify location permissions.',
          details: err?.message || String(err),
        });
      }
      return false;
    }
  }, []);

  // Request location permission from user
  const requestPermission = useCallback(async () => {
    setStatus('REQUESTING_PERMISSION');
    setError(null);

    try {
      const res = await locationService.requestPermissions();
      const granted = res.status === Location.PermissionStatus.GRANTED;

      if (isMounted.current) {
        setPermissionGranted(granted);
        if (granted) {
          setStatus('IDLE');
          setError(null);
        } else {
          setStatus('PERMISSION_DENIED');
          setError({
            code: 'PERMISSION_DENIED',
            message: 'Location access is required to track your physical position.',
          });
        }
      }
      return granted;
    } catch (err: any) {
      if (isMounted.current) {
        setStatus('ERROR');
        setError({
          code: 'PERMISSION_DENIED',
          message: 'Failed to request location permission.',
          details: err?.message || String(err),
        });
      }
      return false;
    }
  }, []);

  // Start foreground tracking
  const startTracking = useCallback(async () => {
    setError(null);

    const gpsEnabled = await locationService.isGpsEnabled();
    if (!gpsEnabled) {
      setStatus('GPS_DISABLED');
      setError({
        code: 'GPS_DISABLED',
        message: 'GPS is disabled on your device. Turn on Location services to start tracking.',
      });
      return;
    }

    const permRes = await locationService.checkPermissions();
    if (permRes.status !== Location.PermissionStatus.GRANTED) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    setStatus('TRACKING');

    await locationService.startForegroundTracking(
      (newLocation) => {
        if (isMounted.current) {
          setLocation(newLocation);
          setStatus('TRACKING');
          setError(null);
        }
      },
      (locError) => {
        if (isMounted.current) {
          setError(locError);
          if (locError.code === 'GPS_DISABLED') setStatus('GPS_DISABLED');
          else if (locError.code === 'PERMISSION_DENIED') setStatus('PERMISSION_DENIED');
          else setStatus('ERROR');
        }
      }
    );
  }, [requestPermission]);

  // Stop foreground tracking
  const stopTracking = useCallback(async () => {
    await locationService.stopForegroundTracking();
    if (isMounted.current) {
      setStatus('IDLE');
    }
  }, []);

  // Fetch one-time GPS fix
  const refreshLocation = useCallback(async () => {
    try {
      const fix = await locationService.getCurrentLocation();
      if (isMounted.current) {
        setLocation(fix);
        setError(null);
      }
    } catch (err: any) {
      if (isMounted.current) {
        setError(err);
      }
    }
  }, []);

  // Open settings wrapper
  const openSettings = useCallback(async () => {
    await locationService.openSettings();
  }, []);

  // Initial setup check
  useEffect(() => {
    isMounted.current = true;
    checkStatus();

    return () => {
      isMounted.current = false;
      locationService.stopForegroundTracking();
    };
  }, [checkStatus]);

  return {
    location,
    status,
    error,
    permissionGranted,
    isGpsEnabled,
    startTracking,
    stopTracking,
    refreshLocation,
    requestPermission,
    openSettings,
    checkStatus,
  };
}

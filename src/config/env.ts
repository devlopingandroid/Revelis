import * as Location from 'expo-location';
import { Platform } from 'react-native';

/**
 * Revelis Environment & Configuration File
 * Contains default settings for location services, backend endpoints,
 * tracking intervals, and application metadata.
 */

// Host Wi-Fi IP address for physical Android phone testing over local Wi-Fi
const HOST_WIFI_IP = '192.168.1.5';

// API Candidate URLs ordered by priority: Local Wi-Fi IP -> Android Emulator Loopback -> Localhost
export const API_CANDIDATE_URLS = [
  `http://${HOST_WIFI_IP}:5000`,
  'http://10.0.2.2:5000',
  'http://localhost:5000',
];

export const CONFIG = {
  APP_NAME: 'Revelis',
  APP_VERSION: '1.0.0',

  /**
   * Primary Backend API Server URL
   */
  API_URL: `http://${HOST_WIFI_IP}:5000`,

  LOCATION: {
    /**
     * GPS desired accuracy mode.
     */
    ACCURACY: Location.Accuracy.High,

    /**
     * Time interval between location updates in milliseconds (3000ms = 3 seconds).
     */
    TIME_INTERVAL: 3000,

    /**
     * Minimum distance change in meters before receiving a location update.
     */
    DISTANCE_FILTER_METERS: 5,

    /**
     * Maximum acceptable GPS accuracy in meters for trigger events.
     */
    ACCURACY_THRESHOLD_METERS: 50,
  },

  BACKGROUND_TASK_NAME: 'REVELIS_BACKGROUND_LOCATION_TASK',
};

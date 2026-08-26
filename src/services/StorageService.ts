import AsyncStorage from '@react-native-async-storage/async-storage';
import { GeofenceEventRecord } from '../types/geofence';

const STORAGE_KEYS = {
  LAST_EVENT: '@revelis_last_geofence_event',
  EVENT_HISTORY: '@revelis_geofence_history',
};

type EventListener = (event: GeofenceEventRecord | null) => void;

/**
 * StorageService
 * Manages persistent storage of background geofence events and
 * provides an in-memory event emitter for real-time UI synchronization.
 */
export class StorageService {
  private listeners: Set<EventListener> = new Set();

  /**
   * Save a newly triggered geofence event record.
   */
  public async saveGeofenceEvent(record: GeofenceEventRecord): Promise<void> {
    try {
      console.log('[StorageService] Saving geofence event:', record);
      
      // Save last event
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_EVENT, JSON.stringify(record));

      // Append to history log
      const history = await this.getEventHistory();
      const updatedHistory = [record, ...history].slice(0, 50); // Keep last 50 events
      await AsyncStorage.setItem(STORAGE_KEYS.EVENT_HISTORY, JSON.stringify(updatedHistory));

      // Broadcast to active UI listeners
      this.notifyListeners(record);
    } catch (error) {
      console.error('[StorageService] Failed to save geofence event:', error);
    }
  }

  /**
   * Fetch the most recent geofence event record.
   */
  public async getLastGeofenceEvent(): Promise<GeofenceEventRecord | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_EVENT);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('[StorageService] Failed to fetch last geofence event:', error);
      return null;
    }
  }

  /**
   * Fetch full geofence event history log.
   */
  public async getEventHistory(): Promise<GeofenceEventRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EVENT_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[StorageService] Failed to fetch event history:', error);
      return [];
    }
  }

  /**
   * Clear event history log.
   */
  public async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_EVENT);
      await AsyncStorage.removeItem(STORAGE_KEYS.EVENT_HISTORY);
      this.notifyListeners(null);
    } catch (error) {
      console.error('[StorageService] Failed to clear geofence history:', error);
    }
  }

  /**
   * Subscribe to real-time geofence event updates while app is active.
   */
  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(record: GeofenceEventRecord | null): void {
    this.listeners.forEach((listener) => {
      try {
        listener(record);
      } catch (err) {
        console.error('[StorageService] Listener error:', err);
      }
    });
  }
}

export const storageService = new StorageService();

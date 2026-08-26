import { DELHI_PLACES } from '../data/places';
import { LocationData } from '../types/location';
import { Place, PlaceCategory } from '../types/place';
import { geoService } from './GeoService';

/**
 * PlaceRepository
 * 
 * Data abstraction layer for retrieving heritage locations.
 * Currently backed by in-memory places registry, but designed to easily adapt
 * to SQLite or backend REST API services in future phases without breaking domain logic.
 */
export class PlaceRepository {
  private places: Place[] = DELHI_PLACES;

  /**
   * Fetch all registered tourist places.
   */
  public async getAllPlaces(): Promise<Place[]> {
    return [...this.places];
  }

  /**
   * Fetch a specific place by its unique ID.
   */
  public async getPlaceById(id: string): Promise<Place | undefined> {
    return this.places.find((p) => p.id === id);
  }

  /**
   * Fetch places matching a specific category (monument, heritage, etc.).
   */
  public async getPlacesByCategory(category: PlaceCategory): Promise<Place[]> {
    return this.places.filter((p) => p.category === category);
  }

  /**
   * Find the closest tourist place relative to the user's current GPS location.
   */
  public findNearestPlace(userLocation: LocationData): { place: Place; distanceMeters: number } | null {
    if (!this.places.length) return null;

    let nearestPlace: Place = this.places[0];
    let minDistance = Infinity;

    for (const place of this.places) {
      const distance = geoService.calculateDistanceMeters(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        place.location
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestPlace = place;
      }
    }

    return { place: nearestPlace, distanceMeters: minDistance };
  }

  /**
   * Search places by name or description.
   */
  public async searchPlaces(query: string): Promise<Place[]> {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAllPlaces();
    return this.places.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
}

export const placeRepository = new PlaceRepository();

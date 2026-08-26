import { API_CANDIDATE_URLS, CONFIG } from '../config/env';
import { FALLBACK_NARRATIONS } from '../data/fallbackNarrations';
import { placeRepository } from './PlaceRepository';
import { NarrationRequest, NarrationResponse, SupportedLanguage } from '../types/narration';

/**
 * AIService Abstraction
 * 
 * Mobile API client communicating with backend server (POST /api/narrate).
 * Tries Wi-Fi IP, emulator loopback, and localhost endpoints sequentially,
 * guaranteeing zero secret exposure in mobile app and seamless physical phone connectivity.
 */
export class AIService {
  /**
   * Request AI narration generation for a specific place and language from backend server.
   */
  public async generateNarration(request: NarrationRequest): Promise<NarrationResponse> {
    const language: SupportedLanguage = request.language || 'en';
    const placeId = request.placeId;

    // Try candidate URLs sequentially to find active backend server
    for (const baseUrl of API_CANDIDATE_URLS) {
      try {
        console.log(`[AIService] Trying backend AI server at ${baseUrl}/api/narrate...`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout per attempt

        const response = await fetch(`${baseUrl}/api/narrate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            placeId,
            language,
            mode: request.mode || 'discover',
            duration: request.duration || 'short',
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data: NarrationResponse = await response.json();
          console.log(`[AIService] Received backend AI narration from ${baseUrl} for '${data.placeName}' (${data.language})`);
          return data;
        }
      } catch (err: any) {
        console.log(`[AIService] Endpoint ${baseUrl} unreachable (${err?.message || String(err)}). Trying next...`);
      }
    }

    console.warn('[AIService] All backend API endpoints unreachable. Using offline local guide fallback.');
    return await this.getFallbackNarration(placeId, language);
  }

  /**
   * Graceful fallback local narration when offline or server unreachable.
   */
  private async getFallbackNarration(placeId: string, language: SupportedLanguage): Promise<NarrationResponse> {
    const place = await placeRepository.getPlaceById(placeId);
    const placeName = place ? place.name : placeId;
    const category = place ? place.category : 'monument';

    const fallbackTexts = FALLBACK_NARRATIONS[placeId] || FALLBACK_NARRATIONS['india-gate'];
    const text = fallbackTexts[language] || fallbackTexts['en'];

    const wordCount = text.split(/\s+/).length;
    const estimatedAudioDurationSeconds = Math.round(wordCount / 2.2);

    return {
      placeId,
      placeName,
      category,
      language,
      mode: 'discover',
      duration: 'short',
      narration: text,
      wordCount,
      estimatedAudioDurationSeconds,
      timestamp: new Date().toISOString(),
      isFallback: true,
    };
  }
}

export const aiService = new AIService();

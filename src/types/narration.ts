/**
 * AI Narration Data Models & Types
 */

export type SupportedLanguage = 'en' | 'hi' | 'hinglish';

export interface NarrationRequest {
  placeId: string;
  language?: SupportedLanguage;
  mode?: 'discover' | 'tour' | 'brief';
  duration?: 'short' | 'medium' | 'detailed';
}

export interface NarrationResponse {
  placeId: string;
  placeName: string;
  category: string;
  language: SupportedLanguage;
  mode: string;
  duration: string;
  narration: string;
  wordCount: number;
  estimatedAudioDurationSeconds: number;
  timestamp: string;
  isFallback?: boolean;
}

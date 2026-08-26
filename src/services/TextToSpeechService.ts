import * as Speech from 'expo-speech';
import { SupportedLanguage } from '../types/narration';

export interface TTSOptions {
  language?: SupportedLanguage;
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onDone?: () => void;
  onStopped?: () => void;
  onError?: (error: any) => void;
}

/**
 * TextToSpeechService
 * 
 * Reusable voice narration layer wrapping expo-speech.
 * Enforces single active playback, handles language voice mapping,
 * routes audio to system earphones/speakers, and manages a 5-minute place cooldown.
 */
export class TextToSpeechService {
  private isCurrentlySpeaking: boolean = false;
  private isCurrentlyPaused: boolean = false;
  private activePlaceId: string | null = null;
  private cooldownMap: Map<string, number> = new Map();
  private readonly DEFAULT_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes cooldown per place

  /**
   * Speak a text narrative for a target place.
   */
  public async speak(
    placeId: string,
    text: string,
    options: TTSOptions = {}
  ): Promise<boolean> {
    // 1. Stop any currently playing narration to prevent overlapping voices
    await this.stop();

    // 2. Resolve native voice language code
    const voiceLangCode = this.resolveVoiceLanguageCode(options.language || 'en');

    console.log(
      `[TTS] Starting voice narration for place '${placeId}' in language '${voiceLangCode}' (${text.length} chars)...`
    );

    this.isCurrentlySpeaking = true;
    this.isCurrentlyPaused = false;
    this.activePlaceId = placeId;

    // Record cooldown timestamp
    this.cooldownMap.set(placeId, Date.now());

    try {
      Speech.speak(text, {
        language: voiceLangCode,
        rate: options.rate ?? 0.95, // Slightly relaxed speaking speed for clarity
        pitch: options.pitch ?? 1.0,
        onStart: () => {
          console.log(`[TTS] Voice playback started for '${placeId}'`);
          if (options.onStart) options.onStart();
        },
        onDone: () => {
          console.log(`[TTS] Voice playback completed for '${placeId}'`);
          this.isCurrentlySpeaking = false;
          this.isCurrentlyPaused = false;
          this.activePlaceId = null;
          if (options.onDone) options.onDone();
        },
        onStopped: () => {
          console.log(`[TTS] Voice playback stopped for '${placeId}'`);
          this.isCurrentlySpeaking = false;
          this.isCurrentlyPaused = false;
          this.activePlaceId = null;
          if (options.onStopped) options.onStopped();
        },
        onError: (err) => {
          console.error(`[TTS] Voice playback error for '${placeId}':`, err);
          this.isCurrentlySpeaking = false;
          this.isCurrentlyPaused = false;
          this.activePlaceId = null;
          if (options.onError) options.onError(err);
        },
      });
      return true;
    } catch (error) {
      console.error('[TTS] Failed to execute Speech.speak:', error);
      this.isCurrentlySpeaking = false;
      this.activePlaceId = null;
      return false;
    }
  }

  /**
   * Stop active voice narration.
   */
  public async stop(): Promise<void> {
    try {
      const speaking = await Speech.isSpeakingAsync();
      if (speaking || this.isCurrentlySpeaking) {
        console.log('[TTS] Stopping active voice playback...');
        await Speech.stop();
      }
    } catch (err) {
      console.error('[TTS] Error stopping speech:', err);
    } finally {
      this.isCurrentlySpeaking = false;
      this.isCurrentlyPaused = false;
      this.activePlaceId = null;
    }
  }

  /**
   * Pause active voice narration.
   */
  public async pause(): Promise<void> {
    try {
      await Speech.pause();
      this.isCurrentlyPaused = true;
      console.log('[TTS] Voice playback paused.');
    } catch (err) {
      console.error('[TTS] Error pausing speech:', err);
    }
  }

  /**
   * Resume paused voice narration.
   */
  public async resume(): Promise<void> {
    try {
      await Speech.resume();
      this.isCurrentlyPaused = false;
      console.log('[TTS] Voice playback resumed.');
    } catch (err) {
      console.error('[TTS] Error resuming speech:', err);
    }
  }

  /**
   * Check if speech is currently playing.
   */
  public async isSpeaking(): Promise<boolean> {
    try {
      return (await Speech.isSpeakingAsync()) || this.isCurrentlySpeaking;
    } catch (err) {
      return this.isCurrentlySpeaking;
    }
  }

  /**
   * Check if voice playback is paused.
   */
  public isPaused(): boolean {
    return this.isCurrentlyPaused;
  }

  /**
   * Get active place ID being narrated.
   */
  public getActivePlaceId(): string | null {
    return this.activePlaceId;
  }

  /**
   * Cooldown Guardrail: Check if a place can trigger automatic voice narration.
   * Returns false if narration for this place occurred within the cooldown window (5 mins).
   */
  public canTriggerNarration(placeId: string, cooldownMs: number = this.DEFAULT_COOLDOWN_MS): boolean {
    const lastTime = this.cooldownMap.get(placeId);
    if (!lastTime) return true;

    const elapsed = Date.now() - lastTime;
    return elapsed >= cooldownMs;
  }

  /**
   * Get remaining cooldown time in seconds for a specific place (0 if ready).
   */
  public getCooldownRemainingSeconds(placeId: string, cooldownMs: number = this.DEFAULT_COOLDOWN_MS): number {
    const lastTime = this.cooldownMap.get(placeId);
    if (!lastTime) return 0;

    const elapsed = Date.now() - lastTime;
    if (elapsed >= cooldownMs) return 0;

    return Math.ceil((cooldownMs - elapsed) / 1000);
  }

  /**
   * Reset cooldown timer for a place.
   */
  public resetCooldown(placeId: string): void {
    this.cooldownMap.delete(placeId);
  }

  /**
   * Map application language selection ('en' | 'hi' | 'hinglish') to native TTS BCP-47 language tag.
   */
  private resolveVoiceLanguageCode(language: SupportedLanguage): string {
    switch (language) {
      case 'hi':
        return 'hi-IN';
      case 'hinglish':
        return 'en-IN'; // Indian English voice provides natural pronunciation for Hinglish terms
      case 'en':
      default:
        return 'en-US';
    }
  }
}

export const ttsService = new TextToSpeechService();

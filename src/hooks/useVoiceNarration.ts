import { useCallback, useEffect, useRef, useState } from 'react';
import { aiService } from '../services/AIService';
import { ttsService } from '../services/TextToSpeechService';
import { SupportedLanguage } from '../types/narration';
import { Place } from '../types/place';

export function useVoiceNarration() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [activeText, setActiveText] = useState<string>('');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  const isMounted = useRef<boolean>(true);

  // Play voice narration for a given place & text
  const playVoiceNarration = useCallback(
    async (place: Place, text: string, lang: SupportedLanguage = language) => {
      setActivePlace(place);
      setActiveText(text);

      const success = await ttsService.speak(place.id, text, {
        language: lang,
        onStart: () => {
          if (isMounted.current) {
            setIsPlaying(true);
            setIsPaused(false);
          }
        },
        onDone: () => {
          if (isMounted.current) {
            setIsPlaying(false);
            setIsPaused(false);
          }
        },
        onStopped: () => {
          if (isMounted.current) {
            setIsPlaying(false);
            setIsPaused(false);
          }
        },
        onError: (err) => {
          console.error('[useVoiceNarration] Playback error:', err);
          if (isMounted.current) {
            setIsPlaying(false);
            setIsPaused(false);
          }
        },
      });

      return success;
    },
    [language]
  );

  // Pause playback
  const pauseVoiceNarration = useCallback(async () => {
    await ttsService.pause();
    if (isMounted.current) setIsPaused(true);
  }, []);

  // Resume playback
  const resumeVoiceNarration = useCallback(async () => {
    await ttsService.resume();
    if (isMounted.current) setIsPaused(false);
  }, []);

  // Stop playback
  const stopVoiceNarration = useCallback(async () => {
    await ttsService.stop();
    if (isMounted.current) {
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, []);

  // Replay current narration
  const replayVoiceNarration = useCallback(async () => {
    if (activePlace && activeText) {
      await playVoiceNarration(activePlace, activeText, language);
    }
  }, [activePlace, activeText, language, playVoiceNarration]);

  // Automatic geofence ENTER voice trigger orchestrator
  const autoTriggerGeofenceNarration = useCallback(
    async (place: Place, lang: SupportedLanguage = language) => {
      // 1. Check place cooldown (5 mins)
      const canTrigger = ttsService.canTriggerNarration(place.id);
      if (!canTrigger) {
        const rem = ttsService.getCooldownRemainingSeconds(place.id);
        console.log(`[useVoiceNarration] Geofence trigger suppressed for '${place.name}' (Cooldown: ${rem}s remaining)`);
        setCooldownSeconds(rem);
        return false;
      }

      console.log(`[useVoiceNarration] Geofence ENTER triggered voice narration for '${place.name}'!`);

      // 2. Fetch AI narration text from backend (with offline fallback)
      const res = await aiService.generateNarration({
        placeId: place.id,
        language: lang,
        mode: 'discover',
      });

      // 3. Play voice narration automatically
      return await playVoiceNarration(place, res.narration, lang);
    },
    [language, playVoiceNarration]
  );

  // Update cooldown timer every second if active
  useEffect(() => {
    isMounted.current = true;
    const interval = setInterval(() => {
      if (activePlace && isMounted.current) {
        const rem = ttsService.getCooldownRemainingSeconds(activePlace.id);
        setCooldownSeconds(rem);
      }
    }, 1000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
      ttsService.stop();
    };
  }, [activePlace]);

  return {
    isPlaying,
    isPaused,
    activePlace,
    activeText,
    language,
    setLanguage,
    cooldownSeconds,
    playVoiceNarration,
    pauseVoiceNarration,
    resumeVoiceNarration,
    stopVoiceNarration,
    replayVoiceNarration,
    autoTriggerGeofenceNarration,
  };
}

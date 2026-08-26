import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { aiService } from '../services/AIService';
import { Colors } from '../theme/colors';
import { NarrationResponse, SupportedLanguage } from '../types/narration';
import { GeofenceEvaluation, Place } from '../types/place';

interface NarrationCardProps {
  place: Place;
  evaluation: GeofenceEvaluation;
}

export const NarrationCard: React.FC<NarrationCardProps> = ({ place, evaluation }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [narration, setNarration] = useState<NarrationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isInsideZone = evaluation.isInsideZone;

  // Generate AI narration for current place & language
  const fetchNarration = async (targetLang: SupportedLanguage = language) => {
    setIsLoading(true);
    try {
      const response = await aiService.generateNarration({
        placeId: place.id,
        language: targetLang,
        mode: 'discover',
        duration: 'short',
      });
      setNarration(response);
    } catch (err) {
      console.error('[NarrationCard] Failed to load narration:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch narration whenever selected place or language changes
  useEffect(() => {
    fetchNarration(language);
  }, [place.id, language]);

  return (
    <View style={[styles.card, isInsideZone && styles.cardActiveZone]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.guideBadge}>🎙️ REVELIS AI LOCAL GUIDE</Text>
          <Text style={styles.placeName}>{place.name}</Text>
        </View>

        {narration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              ~{narration.estimatedAudioDurationSeconds}s audio
            </Text>
          </View>
        )}
      </View>

      {/* Language Selector Chips */}
      <View style={styles.langContainer}>
        <Text style={styles.langLabel}>LANGUAGE:</Text>
        <View style={styles.langChipsRow}>
          <TouchableOpacity
            style={[styles.langChip, language === 'en' && styles.langChipSelected]}
            onPress={() => setLanguage('en')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langChipText, language === 'en' && styles.langChipTextSelected]}>
              English
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langChip, language === 'hi' && styles.langChipSelected]}
            onPress={() => setLanguage('hi')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langChipText, language === 'hi' && styles.langChipTextSelected]}>
              हिंदी
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langChip, language === 'hinglish' && styles.langChipSelected]}
            onPress={() => setLanguage('hinglish')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langChipText, language === 'hinglish' && styles.langChipTextSelected]}>
              Hinglish
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Narration Body / Loading State */}
      <View style={styles.narrationBox}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>Crafting local guide narration...</Text>
          </View>
        ) : narration ? (
          <View>
            <Text style={styles.narrationText}>{narration.narration}</Text>
            <View style={styles.footerMetaRow}>
              <View style={styles.sourceTag}>
                <Text style={styles.sourceTagText}>
                  {narration.isFallback ? '⚡ Offline Guide' : '🌐 Live Backend AI'}
                </Text>
              </View>
              <Text style={styles.wordCountText}>{narration.wordCount} words</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.placeholderText}>Tap below to generate local guide narration.</Text>
        )}
      </View>

      {/* Trigger Button */}
      <TouchableOpacity
        style={styles.generateButton}
        onPress={() => fetchNarration(language)}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <Text style={styles.generateButtonText}>
          {isLoading ? 'GENERATING...' : '🔄 REFRESH AI NARRATION'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  cardActiveZone: {
    borderColor: Colors.success,
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  guideBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  placeName: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  durationBadge: {
    backgroundColor: Colors.cardHighlight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  durationText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '700',
  },
  langContainer: {
    marginBottom: 12,
  },
  langLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  langChipsRow: {
    flexDirection: 'row',
  },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginRight: 8,
  },
  langChipSelected: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  langChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  langChipTextSelected: {
    color: Colors.primary,
  },
  narrationBox: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    minHeight: 90,
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 10,
  },
  narrationText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
    fontStyle: 'normal',
  },
  placeholderText: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  footerMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.cardBorder,
  },
  sourceTag: {
    backgroundColor: Colors.cardHighlight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sourceTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  wordCountText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  generateButton: {
    height: 42,
    backgroundColor: Colors.primaryMuted,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  generateButtonText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
});

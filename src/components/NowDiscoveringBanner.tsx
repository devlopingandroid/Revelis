import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Place } from '../types/place';

interface NowDiscoveringBannerProps {
  place: Place;
  isPlaying: boolean;
  isPaused: boolean;
  activeText: string;
  cooldownSeconds: number;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onReplay: () => void;
}

export const NowDiscoveringBanner: React.FC<NowDiscoveringBannerProps> = ({
  place,
  isPlaying,
  isPaused,
  activeText,
  cooldownSeconds,
  onPlay,
  onPause,
  onResume,
  onStop,
  onReplay,
}) => {
  return (
    <View style={[styles.card, isPlaying && styles.cardPlaying]}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.earphoneBadge}>
          <Text style={styles.earphoneBadgeText}>🎧 HANDS-FREE AUDIO</Text>
        </View>

        {isPlaying ? (
          <View style={styles.playingPulseBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.playingPulseText}>PLAYING VOICE</Text>
          </View>
        ) : isPaused ? (
          <View style={styles.pausedBadge}>
            <Text style={styles.pausedText}>PAUSED</Text>
          </View>
        ) : cooldownSeconds > 0 ? (
          <View style={styles.cooldownBadge}>
            <Text style={styles.cooldownText}>Cooldown: {cooldownSeconds}s</Text>
          </View>
        ) : (
          <View style={styles.readyBadge}>
            <Text style={styles.readyText}>READY FOR DISCOVERY</Text>
          </View>
        )}
      </View>

      {/* Target Place Title */}
      <Text style={styles.placeTitle}>🏛️ Now Discovering: {place.name}</Text>
      <Text style={styles.placeSubtitle}>{place.shortDescription}</Text>

      {/* Audio Transcript Preview Box */}
      {activeText ? (
        <View style={styles.transcriptBox}>
          <Text style={styles.transcriptLabel}>ACTIVE NARRATION VOICE SCRIPT:</Text>
          <Text style={styles.transcriptText} numberOfLines={3}>
            "{activeText}"
          </Text>
        </View>
      ) : null}

      {/* Playback Media Control Bar */}
      <View style={styles.controlsRow}>
        {isPlaying ? (
          <TouchableOpacity
            style={[styles.controlBtn, styles.btnPause]}
            onPress={onPause}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPauseText}>⏸️ PAUSE</Text>
          </TouchableOpacity>
        ) : isPaused ? (
          <TouchableOpacity
            style={[styles.controlBtn, styles.btnPlay]}
            onPress={onResume}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPlayText}>▶️ RESUME</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlBtn, styles.btnPlay]}
            onPress={onPlay}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPlayText}>🔊 START VOICE GUIDE</Text>
          </TouchableOpacity>
        )}

        {(isPlaying || isPaused) && (
          <TouchableOpacity
            style={[styles.controlBtn, styles.btnStop]}
            onPress={onStop}
            activeOpacity={0.8}
          >
            <Text style={styles.btnStopText}>⏹️ STOP</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlBtn, styles.btnReplay]}
          onPress={onReplay}
          activeOpacity={0.8}
        >
          <Text style={styles.btnReplayText}>🔄 REPLAY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardPlaying: {
    borderColor: Colors.success,
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  earphoneBadge: {
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  earphoneBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.8,
  },
  playingPulseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  playingPulseText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.success,
  },
  pausedBadge: {
    backgroundColor: Colors.warningBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pausedText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.warning,
  },
  cooldownBadge: {
    backgroundColor: Colors.cardHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cooldownText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  readyBadge: {
    backgroundColor: Colors.cardHighlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  readyText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  placeTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  placeSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  transcriptBox: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  transcriptLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  transcriptText: {
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  controlsRow: {
    flexDirection: 'row',
  },
  controlBtn: {
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginRight: 8,
  },
  btnPlay: {
    flex: 2,
    backgroundColor: Colors.buttonPrimaryBg,
  },
  btnPlayText: {
    color: Colors.buttonPrimaryText,
    fontSize: 12,
    fontWeight: '900',
  },
  btnPause: {
    flex: 2,
    backgroundColor: Colors.warningBg,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  btnPauseText: {
    color: Colors.warning,
    fontSize: 12,
    fontWeight: '900',
  },
  btnStop: {
    flex: 1,
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  btnStopText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '900',
  },
  btnReplay: {
    flex: 1,
    backgroundColor: Colors.cardHighlight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  btnReplayText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
});

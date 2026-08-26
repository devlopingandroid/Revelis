import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

export const TourismNoticeCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.badge}>PHASE 1 ARCHITECTURE</Text>
      </View>
      <Text style={styles.title}>🏛️ Heritage Tourism Spot Detection</Text>
      <Text style={styles.description}>
        This phase establishes continuous, accurate foreground GPS tracking. As you move near monuments or heritage sites, high-precision coordinates update in real time.
      </Text>
      <View style={styles.divider} />
      <Text style={styles.footerNote}>
        ✨ Future Phase: Background geofencing with expo-task-manager will trigger automated AI voice narration when entering a 50m radius around historical locations.
      </Text>
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
  header: {
    marginBottom: 8,
  },
  badge: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: 12,
  },
  footerNote: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
    fontStyle: 'italic',
  },
});

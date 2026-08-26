import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { LocationData } from '../types/location';

interface CoordinatesCardProps {
  location: LocationData | null;
}

export const CoordinatesCard: React.FC<CoordinatesCardProps> = ({ location }) => {
  if (!location) {
    return (
      <View style={styles.cardEmpty}>
        <Text style={styles.emptyTitle}>No GPS Fix Acquired</Text>
        <Text style={styles.emptySubtitle}>
          Start tracking or tap Refresh GPS to fetch live satellite coordinates.
        </Text>
      </View>
    );
  }

  // Calculate accuracy quality grade
  const getAccuracyBadge = (accuracy: number | null) => {
    if (accuracy === null) return { text: 'Unknown', color: Colors.textMuted };
    if (accuracy <= 10) return { text: `High (±${accuracy.toFixed(1)}m)`, color: Colors.success };
    if (accuracy <= 30) return { text: `Medium (±${accuracy.toFixed(1)}m)`, color: Colors.warning };
    return { text: `Low (±${accuracy.toFixed(1)}m)`, color: Colors.error };
  };

  const accuracyConfig = getAccuracyBadge(location.accuracy);
  const formattedTime = new Date(location.timestamp).toLocaleTimeString();

  return (
    <View style={styles.card}>
      <Text style={styles.sectionHeader}>LIVE TELEMETRY</Text>

      {/* Main Coordinate Grid */}
      <View style={styles.grid}>
        <View style={styles.coordBox}>
          <Text style={styles.coordLabel}>LATITUDE</Text>
          <Text style={styles.coordValue}>{location.latitude.toFixed(6)}°</Text>
        </View>

        <View style={styles.coordBox}>
          <Text style={styles.coordLabel}>LONGITUDE</Text>
          <Text style={styles.coordValue}>{location.longitude.toFixed(6)}°</Text>
        </View>
      </View>

      {/* Secondary Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>GPS Accuracy:</Text>
          <Text style={[styles.metricValue, { color: accuracyConfig.color }]}>
            {accuracyConfig.text}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Altitude:</Text>
          <Text style={styles.metricValue}>
            {location.altitude !== null ? `${location.altitude.toFixed(1)} meters` : 'N/A'}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Movement Speed:</Text>
          <Text style={styles.metricValue}>
            {location.speed !== null && location.speed >= 0
              ? `${(location.speed * 3.6).toFixed(1)} km/h`
              : 'Stationary'}
          </Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Last Fix Time:</Text>
          <Text style={styles.metricValue}>{formattedTime}</Text>
        </View>
      </View>
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
    borderColor: Colors.cardBorder,
  },
  cardEmpty: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  coordBox: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginHorizontal: 4,
  },
  coordLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  coordValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: 'monospace',
  },
  metricsContainer: {
    backgroundColor: Colors.cardHighlight,
    borderRadius: 12,
    padding: 12,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  metricLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

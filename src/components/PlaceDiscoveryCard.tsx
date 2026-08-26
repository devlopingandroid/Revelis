import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { GeofenceEvaluation } from '../types/place';

interface PlaceDiscoveryCardProps {
  evaluation: GeofenceEvaluation;
}

export const PlaceDiscoveryCard: React.FC<PlaceDiscoveryCardProps> = ({ evaluation }) => {
  const { place, distanceMeters, formattedDistance, zoneStatus, accuracyWarning } = evaluation;

  // Determine badge and container styling based on zone status
  const getZoneStyleConfig = () => {
    switch (zoneStatus) {
      case 'INSIDE':
        return {
          badgeText: 'INSIDE DISCOVERY ZONE',
          badgeBg: Colors.successBg,
          badgeBorder: Colors.success,
          badgeTextColor: Colors.success,
          cardBorderColor: Colors.success,
          dotColor: Colors.success,
          statusMessage: '🎯 You have entered the India Gate heritage zone!',
        };
      case 'OUTSIDE':
        return {
          badgeText: 'OUTSIDE DISCOVERY ZONE',
          badgeBg: Colors.primaryMuted,
          badgeBorder: Colors.primary,
          badgeTextColor: Colors.primary,
          cardBorderColor: Colors.cardBorder,
          dotColor: Colors.primary,
          statusMessage: 'Walk towards India Gate to trigger discovery zone.',
        };
      case 'LOW_ACCURACY':
        return {
          badgeText: 'GPS SIGNAL IMPRECISE',
          badgeBg: Colors.warningBg,
          badgeBorder: Colors.warning,
          badgeTextColor: Colors.warning,
          cardBorderColor: Colors.warning,
          dotColor: Colors.warning,
          statusMessage: 'GPS signal is weak. Move to an open area for accurate fix.',
        };
      case 'NO_GPS_FIX':
      default:
        return {
          badgeText: 'AWAITING GPS FIX',
          badgeBg: Colors.cardHighlight,
          badgeBorder: Colors.textMuted,
          badgeTextColor: Colors.textMuted,
          cardBorderColor: Colors.cardBorder,
          dotColor: Colors.textMuted,
          statusMessage: 'Enable GPS tracking to compute distance.',
        };
    }
  };

  const styleConfig = getZoneStyleConfig();

  // Compute visual proximity progress percentage (capped between 0% and 100%)
  const computeProximityPercent = () => {
    if (distanceMeters === null) return 0;
    if (distanceMeters <= place.radiusMeters) return 100;
    // Map 150m - 1000m to 100% - 0%
    const maxRange = 1000;
    const clamped = Math.min(Math.max(distanceMeters, place.radiusMeters), maxRange);
    const ratio = (maxRange - clamped) / (maxRange - place.radiusMeters);
    return Math.round(ratio * 100);
  };

  const proximityPercent = computeProximityPercent();

  return (
    <View style={[styles.card, { borderColor: styleConfig.cardBorderColor }]}>
      {/* Header Row: Target Place & Category */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.placeCategory}>{place.category.toUpperCase()}</Text>
          <Text style={styles.placeName}>{place.name}</Text>
        </View>
        <View style={styles.radiusBadge}>
          <Text style={styles.radiusText}>Radius: {place.radiusMeters}m</Text>
        </View>
      </View>

      <Text style={styles.placeDescription}>{place.description}</Text>

      {/* Primary Status Banner */}
      <View style={[styles.zoneStatusBadge, { backgroundColor: styleConfig.badgeBg, borderColor: styleConfig.badgeBorder }]}>
        <View style={[styles.dot, { backgroundColor: styleConfig.dotColor }]} />
        <Text style={[styles.zoneStatusText, { color: styleConfig.badgeTextColor }]}>
          {styleConfig.badgeText}
        </Text>
      </View>

      {/* Distance Telemetry Metric */}
      <View style={styles.telemetryBox}>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>DISTANCE TO TARGET</Text>
          <Text style={styles.telemetryValue}>{formattedDistance}</Text>
        </View>

        <View style={styles.telemetryDivider} />

        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>DETECTION BOUNDARY</Text>
          <Text style={styles.telemetryValue}>{place.radiusMeters} meters</Text>
        </View>
      </View>

      {/* Proximity Progress Bar */}
      {distanceMeters !== null && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>PROXIMITY RADAR</Text>
            <Text style={styles.progressValue}>{proximityPercent}%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${proximityPercent}%`,
                  backgroundColor: styleConfig.badgeBorder,
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Accuracy Warning Banner */}
      {accuracyWarning && (
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>{accuracyWarning}</Text>
        </View>
      )}

      <Text style={styles.statusMessage}>{styleConfig.statusMessage}</Text>
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
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  placeCategory: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.secondary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  placeName: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  radiusBadge: {
    backgroundColor: Colors.cardHighlight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  radiusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  placeDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
  zoneStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  zoneStatusText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  telemetryBox: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  telemetryItem: {
    flex: 1,
    alignItems: 'center',
  },
  telemetryDivider: {
    width: 1,
    backgroundColor: Colors.cardBorder,
    marginHorizontal: 8,
  },
  telemetryLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  telemetryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: 'monospace',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  progressValue: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: Colors.cardHighlight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: Colors.warningBg,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.warning,
    marginBottom: 10,
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: Colors.warning,
    lineHeight: 16,
    fontWeight: '600',
  },
  statusMessage: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

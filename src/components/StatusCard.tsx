import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';
import { LocationErrorState, TrackingStatus } from '../types/location';

interface StatusCardProps {
  status: TrackingStatus;
  error: LocationErrorState | null;
}

export const StatusCard: React.FC<StatusCardProps> = ({ status, error }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'TRACKING':
        return {
          label: 'GPS TRACKING ACTIVE',
          message: 'Receiving live GPS coordinates from physical sensors.',
          badgeBg: Colors.successBg,
          borderColor: Colors.success,
          dotColor: Colors.success,
        };
      case 'IDLE':
        return {
          label: 'STANDBY',
          message: 'Foreground tracking is currently paused. Tap Start Tracking to begin.',
          badgeBg: Colors.cardHighlight,
          borderColor: Colors.textMuted,
          dotColor: Colors.textMuted,
        };
      case 'CHECKING_PERMISSIONS':
      case 'REQUESTING_PERMISSION':
        return {
          label: 'VERIFYING PERMISSIONS',
          message: 'Checking location access rights...',
          badgeBg: Colors.warningBg,
          borderColor: Colors.warning,
          dotColor: Colors.warning,
        };
      case 'PERMISSION_DENIED':
        return {
          label: 'PERMISSION DENIED',
          message: error?.message || 'Location permission denied. Grant access to track position.',
          badgeBg: Colors.errorBg,
          borderColor: Colors.error,
          dotColor: Colors.error,
        };
      case 'GPS_DISABLED':
        return {
          label: 'GPS SERVICES OFF',
          message: error?.message || 'Device location services are turned off in Android settings.',
          badgeBg: Colors.errorBg,
          borderColor: Colors.error,
          dotColor: Colors.error,
        };
      case 'ERROR':
      default:
        return {
          label: 'LOCATION ERROR',
          message: error?.message || 'An unexpected error occurred while fetching GPS position.',
          badgeBg: Colors.errorBg,
          borderColor: Colors.error,
          dotColor: Colors.error,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.card, { borderColor: config.borderColor }]}>
      <View style={styles.headerRow}>
        <View style={[styles.badge, { backgroundColor: config.badgeBg }]}>
          <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
          <Text style={[styles.badgeText, { color: config.borderColor }]}>
            {config.label}
          </Text>
        </View>
        <Text style={styles.statusTag}>Foreground GPS</Text>
      </View>
      <Text style={styles.message}>{config.message}</Text>

      {error?.details && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>Diagnostic: {error.details}</Text>
        </View>
      )}
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
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  statusTag: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  detailsContainer: {
    marginTop: 10,
    padding: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  detailsText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { TrackingStatus } from '../types/location';

interface LocationControlsProps {
  status: TrackingStatus;
  permissionGranted: boolean;
  isGpsEnabled: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onRefreshLocation: () => void;
  onRequestPermission: () => void;
  onOpenSettings: () => void;
}

export const LocationControls: React.FC<LocationControlsProps> = ({
  status,
  permissionGranted,
  isGpsEnabled,
  onStartTracking,
  onStopTracking,
  onRefreshLocation,
  onRequestPermission,
  onOpenSettings,
}) => {
  const isTracking = status === 'TRACKING';

  return (
    <View style={styles.container}>
      {/* Primary Action Button */}
      {isTracking ? (
        <TouchableOpacity
          style={[styles.button, styles.buttonDanger]}
          onPress={onStopTracking}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonDangerText}>PAUSE TRACKING</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={onStartTracking}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonPrimaryText}>START FOREGROUND TRACKING</Text>
        </TouchableOpacity>
      )}

      {/* Action Row for Refresh and Permission / Settings */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.secondaryButton, { flex: 1, marginRight: 8 }]}
          onPress={onRefreshLocation}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>⚡ Refresh GPS Fix</Text>
        </TouchableOpacity>

        {(!permissionGranted || !isGpsEnabled) && (
          <TouchableOpacity
            style={[styles.secondaryButton, styles.accentSecondaryButton, { flex: 1 }]}
            onPress={!permissionGranted ? onRequestPermission : onOpenSettings}
            activeOpacity={0.8}
          >
            <Text style={styles.accentSecondaryButtonText}>
              {!permissionGranted ? 'Grant Permission' : 'Open Settings'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  button: {
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonPrimary: {
    backgroundColor: Colors.buttonPrimaryBg,
  },
  buttonPrimaryText: {
    color: Colors.buttonPrimaryText,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  buttonDanger: {
    backgroundColor: Colors.buttonDangerBg,
  },
  buttonDangerText: {
    color: Colors.buttonDangerText,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
  },
  secondaryButton: {
    height: 44,
    backgroundColor: Colors.buttonSecondaryBg,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  secondaryButtonText: {
    color: Colors.buttonSecondaryText,
    fontSize: 13,
    fontWeight: '700',
  },
  accentSecondaryButton: {
    borderColor: Colors.warning,
    backgroundColor: Colors.warningBg,
  },
  accentSecondaryButtonText: {
    color: Colors.warning,
    fontSize: 13,
    fontWeight: '700',
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { GeofenceEventRecord } from '../types/geofence';
import { LocationData } from '../types/location';
import { GeofenceEvaluation } from '../types/place';

interface GeofenceDebugCardProps {
  isRegistered: boolean;
  isRegistering: boolean;
  userLocation: LocationData | null;
  evaluation: GeofenceEvaluation;
  lastEvent: GeofenceEventRecord | null;
  onRegister: () => void;
  onUnregister: () => void;
  onClearHistory: () => void;
}

export const GeofenceDebugCard: React.FC<GeofenceDebugCardProps> = ({
  isRegistered,
  isRegistering,
  userLocation,
  evaluation,
  lastEvent,
  onRegister,
  onUnregister,
  onClearHistory,
}) => {
  const { place, formattedDistance, zoneStatus } = evaluation;

  // Format last event timestamp
  const lastEventTimeStr = lastEvent
    ? new Date(lastEvent.timestamp).toLocaleTimeString()
    : 'No events logged';

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>🛠️ GEOFENCE DEBUG DASHBOARD</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isRegistered ? Colors.successBg : Colors.cardHighlight,
              borderColor: isRegistered ? Colors.success : Colors.textMuted,
            },
          ]}
        >
          <View
            style={[
              styles.dot,
              { backgroundColor: isRegistered ? Colors.success : Colors.textMuted },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: isRegistered ? Colors.success : Colors.textMuted },
            ]}
          >
            {isRegistered ? 'REGISTERED' : 'NOT REGISTERED'}
          </Text>
        </View>
      </View>

      {/* Grid of 5 Debug Parameters */}
      <View style={styles.debugGrid}>
        {/* 1. Target Place & Boundary */}
        <View style={styles.debugItem}>
          <Text style={styles.debugLabel}>TARGET SPOT</Text>
          <Text style={styles.debugValue}>{place.name} ({place.radiusMeters}m)</Text>
        </View>

        {/* 2. Current GPS Location */}
        <View style={styles.debugItem}>
          <Text style={styles.debugLabel}>CURRENT COORDS</Text>
          <Text style={styles.debugValueSmall}>
            {userLocation
              ? `${userLocation.latitude.toFixed(5)}, ${userLocation.longitude.toFixed(5)}`
              : 'No GPS Fix'}
          </Text>
        </View>

        {/* 3. Distance from India Gate */}
        <View style={styles.debugItem}>
          <Text style={styles.debugLabel}>DISTANCE FROM TARGET</Text>
          <Text style={styles.debugValue}>{formattedDistance}</Text>
        </View>

        {/* 4. Current Geofence State */}
        <View style={styles.debugItem}>
          <Text style={styles.debugLabel}>GEOFENCE STATE</Text>
          <Text
            style={[
              styles.debugValue,
              {
                color:
                  zoneStatus === 'INSIDE'
                    ? Colors.success
                    : zoneStatus === 'OUTSIDE'
                    ? Colors.primary
                    : Colors.warning,
              },
            ]}
          >
            {zoneStatus}
          </Text>
        </View>

        {/* 5. Last Event & Timestamp */}
        <View style={[styles.debugItem, { flexBasis: '100%' }]}>
          <Text style={styles.debugLabel}>LAST GEOFENCE EVENT</Text>
          <View style={styles.eventRow}>
            <Text
              style={[
                styles.eventBadgeText,
                {
                  color:
                    lastEvent?.eventType === 'ENTER'
                      ? Colors.success
                      : lastEvent?.eventType === 'EXIT'
                      ? Colors.error
                      : Colors.textMuted,
                },
              ]}
            >
              {lastEvent ? lastEvent.eventType : 'NONE'}
            </Text>
            <Text style={styles.eventTimeText}>
              {lastEvent ? `at ${lastEventTimeStr} (${lastEvent.placeName})` : ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Controls */}
      <View style={styles.actionsRow}>
        {!isRegistered ? (
          <TouchableOpacity
            style={[styles.btn, styles.btnSuccess]}
            onPress={onRegister}
            disabled={isRegistering}
            activeOpacity={0.8}
          >
            <Text style={styles.btnSuccessText}>
              {isRegistering ? 'Registering...' : 'Enable Background Geofence'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.btn, styles.btnDanger]}
            onPress={onUnregister}
            disabled={isRegistering}
            activeOpacity={0.8}
          >
            <Text style={styles.btnDangerText}>
              {isRegistering ? 'Stopping...' : 'Disable Background Geofence'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={onClearHistory}
          activeOpacity={0.8}
        >
          <Text style={styles.btnSecondaryText}>Clear Log</Text>
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
    borderColor: Colors.secondary,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: Colors.secondary,
    letterSpacing: 1.2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  debugGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  debugItem: {
    flexBasis: '50%',
    padding: 6,
  },
  debugLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  debugValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: 'monospace',
  },
  debugValueSmall: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    fontFamily: 'monospace',
  },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  eventBadgeText: {
    fontSize: 14,
    fontWeight: '900',
    marginRight: 6,
    fontFamily: 'monospace',
  },
  eventTimeText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionsRow: {
    flexDirection: 'row',
  },
  btn: {
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  btnSuccess: {
    flex: 2,
    backgroundColor: Colors.successBg,
    borderWidth: 1,
    borderColor: Colors.success,
    marginRight: 8,
  },
  btnSuccessText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '800',
  },
  btnDanger: {
    flex: 2,
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.error,
    marginRight: 8,
  },
  btnDangerText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '800',
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: Colors.cardHighlight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  btnSecondaryText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
});

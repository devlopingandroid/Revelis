import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../theme/colors';

export const Header: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>REVELIS</Text>
        <View style={styles.modeBadge}>
          <View style={styles.modeDot} />
          <Text style={styles.modeText}>DISCOVER MODE</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>
        AI-Powered Smart Tourism & Heritage Audio Guide
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: 3,
  },
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  modeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 6,
  },
  modeText: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Place } from '../types/place';

interface PlaceSelectorProps {
  places: Place[];
  selectedPlace: Place;
  onSelectPlace: (place: Place) => void;
}

export const PlaceSelector: React.FC<PlaceSelectorProps> = ({
  places,
  selectedPlace,
  onSelectPlace,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>EXPLORE HERITAGE PLACES</Text>
        <Text style={styles.placeCount}>{places.length} Spots Active</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {places.map((place) => {
          const isSelected = place.id === selectedPlace.id;
          return (
            <TouchableOpacity
              key={place.id}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipUnselected,
              ]}
              onPress={() => onSelectPlace(place)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                ]}
              >
                {place.name}
              </Text>
              <Text style={styles.chipRadius}>{place.radiusMeters}m</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  placeCount: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  chipSelected: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  chipUnselected: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.cardBorder,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    marginRight: 6,
  },
  chipTextSelected: {
    color: Colors.primary,
  },
  chipTextUnselected: {
    color: Colors.textSecondary,
  },
  chipRadius: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
});

import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CoordinatesCard } from '../components/CoordinatesCard';
import { GeofenceDebugCard } from '../components/GeofenceDebugCard';
import { Header } from '../components/Header';
import { LocationControls } from '../components/LocationControls';
import { NarrationCard } from '../components/NarrationCard';
import { NowDiscoveringBanner } from '../components/NowDiscoveringBanner';
import { PlaceDiscoveryCard } from '../components/PlaceDiscoveryCard';
import { PlaceSelector } from '../components/PlaceSelector';
import { StatusCard } from '../components/StatusCard';
import { TourismNoticeCard } from '../components/TourismNoticeCard';
import { useLocation } from '../hooks/useLocation';
import { useMultiPlaceGeofence } from '../hooks/useMultiPlaceGeofence';
import { useVoiceNarration } from '../hooks/useVoiceNarration';
import { Colors } from '../theme/colors';

export const DiscoverScreen: React.FC = () => {
  const {
    location,
    status,
    error,
    permissionGranted,
    isGpsEnabled,
    startTracking,
    stopTracking,
    refreshLocation,
    requestPermission,
    openSettings,
  } = useLocation();

  // Multi-Place Geofence System hook
  const {
    allPlaces,
    selectedPlace,
    setSelectedPlace,
    selectedEvaluation,
    isRegistered,
    isRegistering,
    lastEvent,
    registerAllGeofences,
    unregisterAllGeofences,
    clearHistory,
  } = useMultiPlaceGeofence(location);

  // Voice Narration Hook (Phase 6)
  const {
    isPlaying,
    isPaused,
    activeText,
    language,
    cooldownSeconds,
    playVoiceNarration,
    pauseVoiceNarration,
    resumeVoiceNarration,
    stopVoiceNarration,
    replayVoiceNarration,
    autoTriggerGeofenceNarration,
  } = useVoiceNarration();

  const prevIsInsideRef = useRef<boolean>(false);

  // Automatic Hands-free Voice Trigger: When user enters the 150m discovery zone
  useEffect(() => {
    const isCurrentlyInside = selectedEvaluation.isInsideZone;
    const justEntered = isCurrentlyInside && !prevIsInsideRef.current;
    prevIsInsideRef.current = isCurrentlyInside;

    if (justEntered) {
      console.log(`[DiscoverScreen] Geofence ENTER detected for '${selectedPlace.name}'! Auto-triggering voice guide...`);
      autoTriggerGeofenceNarration(selectedPlace, language);
    }
  }, [selectedEvaluation.isInsideZone, selectedPlace, language, autoTriggerGeofenceNarration]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatusCard status={status} error={error} />

        {/* Multi-Place Explorer Selector */}
        <PlaceSelector
          places={allPlaces}
          selectedPlace={selectedPlace}
          onSelectPlace={(place) => {
            stopVoiceNarration();
            setSelectedPlace(place);
          }}
        />

        {/* Hands-Free Voice Audio Guide Banner (Phase 6) */}
        <NowDiscoveringBanner
          place={selectedPlace}
          isPlaying={isPlaying}
          isPaused={isPaused}
          activeText={activeText}
          cooldownSeconds={cooldownSeconds}
          onPlay={() => autoTriggerGeofenceNarration(selectedPlace, language)}
          onPause={pauseVoiceNarration}
          onResume={resumeVoiceNarration}
          onStop={stopVoiceNarration}
          onReplay={replayVoiceNarration}
        />

        {/* Selected Place Discovery Zone Card */}
        <PlaceDiscoveryCard evaluation={selectedEvaluation} />

        {/* AI Local Guide Narration Engine (Phase 5) */}
        <NarrationCard place={selectedPlace} evaluation={selectedEvaluation} />

        {/* Multi-Place Geofence Debug Dashboard */}
        <GeofenceDebugCard
          isRegistered={isRegistered}
          isRegistering={isRegistering}
          userLocation={location}
          evaluation={selectedEvaluation}
          lastEvent={lastEvent}
          onRegister={registerAllGeofences}
          onUnregister={unregisterAllGeofences}
          onClearHistory={clearHistory}
        />

        <CoordinatesCard location={location} />

        <LocationControls
          status={status}
          permissionGranted={permissionGranted}
          isGpsEnabled={isGpsEnabled}
          onStartTracking={startTracking}
          onStopTracking={stopTracking}
          onRefreshLocation={refreshLocation}
          onRequestPermission={requestPermission}
          onOpenSettings={openSettings}
        />

        <TourismNoticeCard />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  bottomSpacer: {
    height: 20,
  },
});

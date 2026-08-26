# Revelis - AI-Powered Tourism Mobile App

Revelis is a React Native Expo application designed for smart heritage tourism. When travellers physically explore heritage spots with earphones connected, Revelis tracks their location in real time, registers native background geofences around iconic monuments, fetches conversational AI local guide stories, and automatically narrates them hands-free.

---

## 🎧 Phase 6 Feature: Hands-Free Voice Narration Layer (`expo-speech`)

### Flow & User Experience
```
Geofence ENTER
 └─► Identify Place (India Gate, Red Fort, Qutub Minar, etc.)
     └─► Request AI Narration (POST /api/narrate)
         └─► Receive AI Local Guide Story (English / Hindi / Hinglish)
             └─► Convert Text to Speech (expo-speech)
                 └─► Auto-play through Bluetooth Earphones / Phone Speaker
```

### Core Capabilities & Guardrails
1. **Reusable `TextToSpeechService` (`src/services/TextToSpeechService.ts`)**: Encapsulates `expo-speech` native voice synthesis (`speak`, `pause`, `resume`, `stop`).
2. **Single Playback Enforcement**: Stops active speech automatically before starting a new narration to prevent overlapping audio.
3. **Graceful Place Transition**: If the traveller enters a new location while narration is playing, the active narration stops immediately, and the new place narration begins.
4. **5-Minute Place Cooldown**: Enforces a 5-minute cooldown per place to prevent repetitive voice triggers when walking along boundaries.
5. **Hands-Free Audio Routing**: Routes voice output natively to connected Bluetooth earphones or system speakers.
6. **"Now Discovering" UI Banner (`NowDiscoveringBanner.tsx`)**: Interactive audio player showing active place title, audio wave pulse visualizer, preview transcript, play/pause/stop/replay controls, and cooldown timer.

---

## 🚀 Quick Start Guide

### 1. Start the Backend API Server
```bash
cd server
npm install
npm start
```
*Server runs on `http://localhost:5000` (and `http://10.0.2.2:5000` for Android emulator).*

### 2. Launch the Mobile App
```bash
# In root directory
npx expo start
```
Scan the QR code with **Expo Go** on your physical Android phone.

---

## 🏛️ Heritage Landmarks Database (8 Spots)

- **India Gate** (`150m` radius, `28.6129, 77.2295`)
- **Red Fort** (`200m` radius, `28.6562, 77.2410`)
- **Qutub Minar** (`150m` radius, `28.5245, 77.1855`)
- **Humayun's Tomb** (`150m` radius, `28.5849, 77.2507`)
- **Lotus Temple** (`150m` radius, `28.5535, 77.2588`)
- **Jantar Mantar** (`150m` radius, `28.6271, 77.2166`)
- **National War Memorial** (`150m` radius, `28.6119, 77.2294`)
- **Rashtrapati Bhavan** (`200m` radius, `28.6143, 77.1994`)

---

## 📁 Complete Project Architecture

```
Revelis/
├── server/                           # Backend API Server (No secrets in mobile client!)
│   ├── package.json                  # Dependencies (express, cors, dotenv)
│   ├── .env.example                  # Environment configuration example
│   ├── placesData.js                 # Backend places knowledge base
│   └── index.js                      # Express server with POST /api/narrate
├── app.json                          # Expo CNG config with background location permissions
├── package.json                      # Dependencies (Expo SDK 57, expo-location, expo-task-manager, expo-speech, async-storage)
├── tsconfig.json                     # TypeScript configuration
├── index.ts                          # App entry point importing background task definition
├── App.tsx                           # Root component
├── README.md                         # Documentation & testing guide
└── src/
    ├── config/
    │   └── env.ts                    # Backend API_URL & location config
    ├── data/
    │   ├── places.ts                 # Database of 8 Delhi heritage landmarks
    │   └── fallbackNarrations.ts     # Offline fallback narrations (English, Hindi, Hinglish)
    ├── types/
    │   ├── location.ts               # LocationData & TrackingStatus types
    │   ├── place.ts                  # Place & GeofenceEvaluation types
    │   ├── geofence.ts               # GeofenceEventRecord & GeofenceState types
    │   └── narration.ts              # NarrationRequest & NarrationResponse types
    ├── tasks/
    │   └── geofenceTask.ts           # Background TaskManager geofence task
    ├── services/
    │   ├── LocationService.ts        # Foreground GPS & geofencing API wrapper
    │   ├── GeoService.ts             # Haversine distance formula & accuracy checks
    │   ├── PlaceRepository.ts        # Place data abstraction layer
    │   ├── GeofenceManager.ts        # Multi-place geofence coordinator
    │   ├── StorageService.ts         # Persistent event logging & UI event emitter
    │   ├── AIService.ts              # Mobile API client for POST /api/narrate
    │   └── TextToSpeechService.ts    # Native TTS voice synthesis & cooldown manager
    ├── hooks/
    │   ├── useLocation.ts            # Foreground GPS tracking hook
    │   ├── useGeofence.ts            # Proximity calculation hook
    │   ├── useMultiPlaceGeofence.ts  # Multi-place selection & background geofence hook
    │   └── useVoiceNarration.ts      # Voice playback & automatic geofence ENTER trigger hook
    ├── theme/
    │   └── colors.ts                 # Modern luxury dark AI tourism theme palette
    ├── components/
    │   ├── Header.tsx                # Title & mode indicator
    │   ├── StatusCard.tsx            # Live GPS status card
    │   ├── PlaceSelector.tsx         # Heritage landmark carousel
    │   ├── NowDiscoveringBanner.tsx  # Hands-free Voice Audio Guide & Media Controls UI
    │   ├── PlaceDiscoveryCard.tsx    # Distance & discovery zone UI
    │   ├── NarrationCard.tsx         # AI Local Guide Transcript & Language Selector UI
    │   ├── GeofenceDebugCard.tsx     # Multi-place Debug Dashboard
    │   ├── CoordinatesCard.tsx       # Live telemetry card
    │   ├── LocationControls.tsx      # Control buttons
    │   └── TourismNoticeCard.tsx     # Phase roadmap card
    └── screens/
        └── DiscoverScreen.tsx        # Main Discover Mode screen
```

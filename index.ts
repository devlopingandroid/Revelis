import { registerRootComponent } from 'expo';
// Import background task definition at top-level scope before App initialization
import './src/tasks/geofenceTask';

import App from './App';

registerRootComponent(App);


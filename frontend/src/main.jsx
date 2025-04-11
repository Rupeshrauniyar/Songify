import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import ReactApp from "./App.jsx";
import { SplashScreen } from '@capacitor/splash-screen';
import { App as CapApp } from '@capacitor/app';

// Handle app state changes
CapApp.addListener('appStateChange', ({ isActive }) => {
  if (isActive) {
    // App resumed - perform any required actions
    console.log('App resumed');
  } else {
    // App paused - handle background state
    console.log('App paused');
  }
});

// Initialize and show splash screen
document.addEventListener('DOMContentLoaded', async () => {
  // Hide the web-based splash screen if any
  try {
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true
    });
  } catch (error) {
    console.error('Error showing splash screen:', error);
  }

  // Render the app
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <ReactApp />
    </StrictMode>
  );
});

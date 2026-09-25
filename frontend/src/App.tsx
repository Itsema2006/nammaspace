import { useState, useEffect } from "react";
import "./App.css";
import LandingScreen from "./Screens/LandingScreen.tsx";
import WorkspaceScreen from "./Screens/WorkspaceScreen.tsx";
import DigitalTwinScanScreen from "./Screens/DigitalTwinScanScreen.tsx";

type ScreenType = "landing" | "workspace" | "digital-twin";

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>("landing");

  // On page load / refresh: always reset to the Landing Screen and clean URL hash
  useEffect(() => {
    // Reset to Landing Screen
    setCurrentScreen("landing");

    // Clean any lingering hash on refresh so next refresh also lands on home
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#scan" || hash === "#digital-twin" || hash === "#capture") {
        setCurrentScreen("digital-twin");
      } else if (hash === "#workspace" || hash === "#twins") {
        setCurrentScreen("workspace");
      } else if (hash === "#home" || hash === "" || hash === "#landing") {
        setCurrentScreen("landing");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToWorkspace = () => {
    window.location.hash = "workspace";
    setCurrentScreen("workspace");
  };

  const navigateToLanding = () => {
    window.location.hash = "home";
    setCurrentScreen("landing");
  };

  const navigateToScan = () => {
    window.location.hash = "scan";
    setCurrentScreen("digital-twin");
  };

  return (
    <div className="app-container">
      {currentScreen === "landing" && (
        <LandingScreen
          onNavigateWorkspace={navigateToWorkspace}
          onNavigateScan={navigateToScan}
        />
      )}
      {currentScreen === "workspace" && (
        <WorkspaceScreen
          onNavigateHome={navigateToLanding}
          onNavigateScan={navigateToScan}
        />
      )}
      {currentScreen === "digital-twin" && (
        <DigitalTwinScanScreen
          onBack={navigateToWorkspace}
          onFinishScan={(spaceData) => {
            console.log("Completed digital twin scan:", spaceData);
          }}
        />
      )}
    </div>
  );
}

export default App;
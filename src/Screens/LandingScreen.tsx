import './LandingScreen.css';

// SVG Icons matching the design reference precisely
function SlidersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function BroadcastIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
      <path d="M19.1 4.9C23 8.8 23 15.2 19.1 19.1" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <circle cx="18" cy="4" r="2" fill="#ff5a1f" stroke="#ff5a1f" />
    </svg>
  );
}

function ReticleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8V4h4" />
      <path d="M16 4h4v4" />
      <path d="M20 16v4h-4" />
      <path d="M8 20H4v-4" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <line x1="12" y1="8" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="16" />
      <line x1="8" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="16" y2="12" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 2v7.5L4.5 19.5A2 2 0 0 0 6.2 22h11.6a2 2 0 0 0 1.7-2.5L14 9.5V2" />
      <line x1="8" y1="2" x2="16" y2="2" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  );
}

interface LandingScreenProps {
  onNavigateWorkspace?: () => void;
  onNavigateScan?: () => void;
}

export default function LandingScreen({ onNavigateWorkspace, onNavigateScan }: LandingScreenProps) {
  return (
    <div className="landing-container">
      {/* Top Navigation Bar */}
      <header className="site-header">
        <div className="brand-wrapper">
          <a href="#home" className="brand" aria-label="Namma Space home">
            NAMMA SPACE
          </a>
        </div>

        <nav className="main-nav" aria-label="Main Navigation">
          <a href="#home" className="nav-link active">Home</a>
          <a
            href="#twins"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateWorkspace?.();
            }}
          >
            Digital Twins
          </a>
          <a
            href="#analytics"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateWorkspace?.();
            }}
          >
            Analytics
          </a>
        </nav>

        <div className="account-controls">
          <a
            href="#login"
            className="login-link"
            onClick={(e) => {
              e.preventDefault();
              onNavigateWorkspace?.();
            }}
          >
            LOGIN
          </a>
          <a
            href="#register"
            className="register-btn"
            onClick={(e) => {
              e.preventDefault();
              onNavigateWorkspace?.();
            }}
          >
            REGISTER
          </a>
          <div className="icon-group">
            <button className="icon-btn" aria-label="System Settings" title="System Settings">
              <SlidersIcon />
            </button>
            <button className="icon-btn" aria-label="Live Signal Broadcast" title="Signal Broadcast">
              <BroadcastIcon />
            </button>
            <button className="icon-btn" aria-label="System Alerts" title="Notifications">
              <BellIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Spatial Dashboard View */}
      <main className="hero-section" id="home">
        {/* Left Side: Overview & Actions */}
        <section className="intro-panel" aria-labelledby="hero-title">
          <div className="status-badge">
            <span className="status-pulse" />
            <span className="status-text">SYSTEM.STATUS: ONLINE</span>
          </div>

          <h1 id="hero-title" className="hero-heading">
            Map the<br />
            physical<br />
            world.
          </h1>

          <h2 className="hero-subheading">
            Turn ordinary video<br />
            into an intelligent<br />
            digital twin.
          </h2>

          <p className="hero-description">
            Capture a space with your smartphone.<br />
            Namma Space reconstructs its geometry,<br />
            understands its structure and creates a<br />
            searchable, navigable 3D environment.
          </p>

          <div className="hero-actions">
            <a
              href="#create"
              className="btn-primary"
              onClick={(e) => {
                e.preventDefault();
                onNavigateWorkspace?.();
              }}
            >
              <span className="btn-icon"><ReticleIcon /></span>
              <span className="btn-label">Create<br />Digital<br />Twin</span>
            </a>
            <a
              href="#technology"
              className="btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                onNavigateScan?.();
              }}
            >
              <span className="btn-icon"><FlaskIcon /></span>
              <span className="btn-label">Explore the<br />Technology</span>
            </a>
          </div>

          {/* Key Metrics / Spatial Telemetry */}
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-label">SCAN COVERAGE</span>
              <strong className="stat-value text-mint">94.2%</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">SPATIAL NODES</span>
              <strong className="stat-value text-white">184</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">ROOMS DETECTED</span>
              <strong className="stat-value text-blue">23</strong>
            </div>
            <div className="stat-card">
              <span className="stat-label">FLOORS</span>
              <strong className="stat-value text-white">03</strong>
            </div>
          </div>
        </section>

        {/* Right Side: Spatial Coordinate Canvas */}
        <section className="spatial-canvas" aria-label="Spatial map and digital twin visualization">
          {/* Background Ambient Glowing Orb */}
          <div className="ambient-glow-ring" />

          {/* Grid Axes Crosshairs */}
          <div className="canvas-crosshair horizontal-axis" />
          <div className="canvas-crosshair vertical-axis" />

          {/* Camera Path HUD Card */}
          <div className="camera-hud-card">
            <div className="hud-header">
              <div className="hud-title">
                <span className="hud-icon">[▣</span> CAMERA PATH
              </div>
              <div className="hud-status">
                <span className="rec-dot" />
                <span>REC</span>
              </div>
            </div>
            <div className="camera-wave-graph">
              <svg className="wave-svg" viewBox="0 0 200 60" preserveAspectRatio="none">
                {/* Sinusoidal Dashed Curve */}
                <path
                  d="M 0 32 Q 50 12 100 32 T 200 32"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                {/* Active Tracking Point */}
                <circle cx="102" cy="32" r="3.5" fill="#ff5a1f" className="pulse-tracker" />
              </svg>
            </div>
          </div>

          {/* Spatial Node: Structural Pillar */}
          <div className="spatial-node node-pillar">
            <div className="node-tag tag-pillar">STRUCTURAL_PILLAR [99.8%]</div>
            <div className="wireframe-box box-pillar">
              <div className="node-line line-pillar" />
            </div>
          </div>

          {/* Spatial Node: Workstation Cluster */}
          <div className="spatial-node node-workstation">
            <div className="node-tag tag-workstation">WORKSTATION_CLUSTER [87.4%]</div>
            <div className="wireframe-box box-workstation">
              <div className="inner-corner-frame">
                <span className="center-node-dot" />
              </div>
              <div className="node-line line-workstation" />
            </div>
          </div>

          {/* Live Spatial Coordinate Readout */}
          <div className="canvas-coordinates">
            <span>X 18.42</span>
            <span>Y 04.91</span>
            <span>Z 02.07</span>
          </div>
        </section>
      </main>

      {/* Bottom System Status Bar */}
      <footer className="system-footer">
        <div className="footer-left">
          <span className="footer-item">
            System Health: <strong className="text-mint">100%</strong>
          </span>
          <span className="footer-item">
            Privacy
          </span>
          <span className="footer-item">
            Latency: <strong className="text-white">14ms</strong>
          </span>
        </div>
        <div className="footer-right">
          <span className="version-tag">NAMMA_SYSTEM_V.2.4.0_STABLE</span>
        </div>
      </footer>
    </div>
  );
}

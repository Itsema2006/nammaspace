import React, { useState, useEffect, useMemo } from 'react';
import './WorkspaceScreen.css';
import { getRecordedVideo, listRecordedVideos, type StoredScanVideo } from '../videoStorage';

// SVG Icons matching the design language
function HexagonLogoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}

function WorkspaceGridIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function DigitalTwinsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function AnalyticsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <path d="M3 3l7 7 4-4 7 7" strokeWidth="1.5" />
    </svg>
  );
}

function CaptureIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

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

export interface StoredSpaceItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  floorCount: number;
  roomCount: number;
  poiCount: number;
  size: string;
  status: string;
  image: string;
  quality: string;
  createdAt: string;
}

const DEFAULT_STORED_SPACES: StoredSpaceItem[] = [
  {
    id: 'space-research-014',
    code: 'SPACE_014',
    title: 'RESEARCH\nCENTRE',
    subtitle: 'Facility Alpha Bio-Physics Core',
    floorCount: 3,
    roomCount: 48,
    poiCount: 126,
    size: '1.2GB',
    status: 'DIGITAL TWIN READY',
    image: '/assets/research_centre.jpg',
    quality: '99.4%',
    createdAt: '2026-09-04',
  },
  {
    id: 'space-logistics-021',
    code: 'SPACE_021',
    title: 'LOGISTICS\nHUB',
    subtitle: 'Automated Cargo & Distribution Hangar',
    floorCount: 4,
    roomCount: 32,
    poiCount: 34,
    size: '840MB',
    status: 'DIGITAL TWIN READY',
    image: '/assets/logistics_hub.jpg',
    quality: '97.8%',
    createdAt: '2026-09-05',
  },
  {
    id: 'space-tower-008',
    code: 'SPACE_008',
    title: 'HEADQUARTERS\nTOWER',
    subtitle: 'Apex Complex Multi-Tier Atrium',
    floorCount: 5,
    roomCount: 56,
    poiCount: 24,
    size: '1.8GB',
    status: 'DIGITAL TWIN READY',
    image: '/assets/tower_hq.jpg',
    quality: '98.6%',
    createdAt: '2026-09-07',
  },
];

const LOCAL_STORAGE_KEY = 'namma_stored_spaces_v1';

interface WorkspaceScreenProps {
  onNavigateHome?: () => void;
  onNavigateScan?: () => void;
}

export default function WorkspaceScreen({ onNavigateHome, onNavigateScan }: WorkspaceScreenProps) {
  const [activeTab, setActiveTab] = useState<'workspace' | 'twins' | 'analytics' | 'capture' | 'docs' | 'terminal'>('workspace');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSpaceForViewer, setSelectedSpaceForViewer] = useState<StoredSpaceItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [recordedVideos, setRecordedVideos] = useState<Array<StoredScanVideo & { url: string }>>([]);

  // Form states for creating new space
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceFloors, setNewSpaceFloors] = useState('02');
  const [newSpaceRooms, setNewSpaceRooms] = useState('20');
  const [captureMethod, setCaptureMethod] = useState<'video' | 'lidar'>('video');

  // Load stored work from localStorage or default
  const [spaces, setSpaces] = useState<StoredSpaceItem[]>(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STORED_SPACES;
  });

  // Persist stored work whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(spaces));
    } catch {
      // ignore
    }
  }, [spaces]);

  useEffect(() => {
    let objectUrls: string[] = [];
    let isMounted = true;

    const loadRecordedVideos = async () => {
      try {
        const savedVideos = await listRecordedVideos();
        const videos = await Promise.all(savedVideos.map(async (video) => {
          const blob = await getRecordedVideo(video.id);
          return blob ? { ...video, url: URL.createObjectURL(blob) } : null;
        }));
        const validVideos = videos.filter((video): video is StoredScanVideo & { url: string } => video !== null);
        objectUrls = validVideos.map((video) => video.url);
        if (isMounted) setRecordedVideos(validVideos);
      } catch (error) {
        console.warn('Could not load recorded videos:', error);
      }
    };

    loadRecordedVideos();
    return () => {
      isMounted = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Aggregate telemetry stats from stored work
  const metrics = useMemo(() => {
    const totalSpaces = spaces.length;
    const totalFloors = spaces.reduce((acc, s) => acc + s.floorCount, 0);
    const totalPOIs = spaces.reduce((acc, s) => acc + s.poiCount, 0);
    return {
      activeSpaces: String(totalSpaces).padStart(2, '0'),
      floors: String(totalFloors).padStart(2, '0'),
      pois: totalPOIs,
      avgQuality: '98.2%',
    };
  }, [spaces]);

  const handleCreateSpace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;

    const floorNum = parseInt(newSpaceFloors) || 1;
    const roomNum = parseInt(newSpaceRooms) || 12;
    const generatedPOIs = roomNum * 3 + Math.floor(Math.random() * 10);

    const newSpace: StoredSpaceItem = {
      id: `space-${Date.now()}`,
      code: `SPACE_0${spaces.length + 14}`,
      title: newSpaceName.toUpperCase(),
      subtitle: captureMethod === 'video' ? 'Neural Photogrammetry 4K Scan' : 'LiDAR Point Cloud Reconstructed',
      floorCount: floorNum,
      roomCount: roomNum,
      poiCount: generatedPOIs,
      size: `${(Math.random() * 0.8 + 0.6).toFixed(1)}GB`,
      status: 'DIGITAL TWIN READY',
      image: captureMethod === 'video' ? '/assets/research_centre.jpg' : '/assets/logistics_hub.jpg',
      quality: '98.9%',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSpaces([newSpace, ...spaces]);
    setNewSpaceName('');
    setIsCreateModalOpen(false);
  };

  const handleDeleteSpace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSpaces(spaces.filter((s) => s.id !== id));
    setActiveMenuId(null);
  };

  const handleDuplicateSpace = (space: StoredSpaceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: StoredSpaceItem = {
      ...space,
      id: `space-${Date.now()}`,
      code: `SPACE_0${spaces.length + 15}`,
      title: `${space.title} (COPY)`,
    };
    setSpaces([duplicated, ...spaces]);
    setActiveMenuId(null);
  };

  const handleExportSpace = (space: StoredSpaceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(space, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${space.code}_telemetry.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setActiveMenuId(null);
  };

  const filteredSpaces = spaces.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="workspace-app-layout">
      {/* Left Navigation Sidebar */}
      <aside className="workspace-sidebar" aria-label="Workspace Navigation">
        {/* Brand Header */}
        <div className="sidebar-brand-row">
          <button 
            className="brand-link-btn" 
            onClick={onNavigateHome}
            title="Return to Landing Page"
          >
            <span className="brand-logo-icon"><HexagonLogoIcon /></span>
            <span className="brand-title">NAMMA SPACE</span>
          </button>
        </div>

        {/* Operator Profile Header */}
        <div className="operator-profile-box">
          <div className="operator-avatar">01</div>
          <div className="operator-info">
            <span className="operator-id">OPERATOR_01</span>
            <span className="operator-role">Spatial Lead</span>
          </div>
        </div>

        <div className="sidebar-divider" />

        {/* Main Nav Items */}
        <nav className="sidebar-nav" aria-label="Main Sections">
          <button
            className={`sidebar-nav-item ${activeTab === 'workspace' ? 'active' : ''}`}
            onClick={() => setActiveTab('workspace')}
          >
            <span className="nav-icon"><WorkspaceGridIcon /></span>
            <span className="nav-text">WORKSPACE</span>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'twins' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('twins');
              onNavigateScan?.();
            }}
          >
            <span className="nav-icon"><DigitalTwinsIcon /></span>
            <span className="nav-text">DIGITAL TWINS</span>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className="nav-icon"><AnalyticsIcon /></span>
            <span className="nav-text">ANALYTICS</span>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'capture' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('capture');
              onNavigateScan?.();
            }}
          >
            <span className="nav-icon"><CaptureIcon /></span>
            <span className="nav-text">CAPTURE</span>
          </button>
        </nav>

        {/* Bottom Nav Items */}
        <div className="sidebar-footer-nav">
          <div className="sidebar-divider" />
          <button
            className={`sidebar-nav-item ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            <span className="nav-icon"><DocIcon /></span>
            <span className="nav-text">DOCUMENTATION</span>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'terminal' ? 'active' : ''}`}
            onClick={() => setActiveTab('terminal')}
          >
            <span className="nav-icon"><TerminalIcon /></span>
            <span className="nav-text">TERMINAL</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Body */}
      <div className="workspace-main-wrapper">
        {/* Top Header Row with Search & Controls */}
        <header className="workspace-topbar">
          <div className="search-box-container">
            <span className="search-icon"><SearchIcon /></span>
            <input
              type="text"
              className="search-input"
              placeholder="Search coordinates, spaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search coordinates and spaces"
            />
          </div>

          <div className="topbar-controls">
            <button className="topbar-icon-btn" aria-label="Sliders Control" title="Control Settings">
              <SlidersIcon />
            </button>
            <button className="topbar-icon-btn" aria-label="Signal Stream" title="Signal Stream">
              <BroadcastIcon />
            </button>
            <button className="topbar-icon-btn" aria-label="Notifications" title="Notifications">
              <BellIcon />
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="workspace-content-area" onClick={() => setActiveMenuId(null)}>
          <div className="workspace-header-section">
            <h1 className="workspace-main-title">YOUR SPATIAL WORKSPACE</h1>

            {/* Badges / Metrics Row (Dynamically synced to stored work) */}
            <div className="workspace-metrics-row">
              <div className="metric-pill metric-pill-active">
                <span className="metric-dot" />
                <span>{metrics.activeSpaces} ACTIVE SPACES</span>
              </div>
              <div className="metric-pill">
                <span className="pill-icon">⬖</span>
                <span>{metrics.floors} FLOORS</span>
              </div>
              <div className="metric-pill">
                <span className="pill-icon">📍</span>
                <span>{metrics.pois} POIs</span>
              </div>
              <div className="metric-pill metric-pill-quality">
                <span className="pill-icon">✓</span>
                <span>{metrics.avgQuality} AVG RECONSTRUCTION QUALITY</span>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="workspace-cards-grid">
            {recordedVideos.map((video) => (
              <article className="recorded-video-card" key={video.id}>
                <div className="recorded-video-preview">
                  <video src={video.url} controls preload="metadata" aria-label={video.name} />
                  <span className="recorded-video-badge">LOCAL VIDEO</span>
                </div>
                <div className="recorded-video-body">
                  <span className="space-code-text">CAPTURED SCAN</span>
                  <h2 className="recorded-video-title">{video.name}</h2>
                  <span className="recorded-video-date">{new Date(video.createdAt).toLocaleString()}</span>
                  <a className="recorded-video-download" href={video.url} download={video.name}>
                    DOWNLOAD VIDEO
                  </a>
                </div>
              </article>
            ))}

            {/* Create New Space Action Card */}
            <div
              className="create-space-card"
              role="button"
              tabIndex={0}
              onClick={() => setIsCreateModalOpen(true)}
              onKeyDown={(e) => e.key === 'Enter' && setIsCreateModalOpen(true)}
            >
              <div className="create-icon-box">
                <span className="plus-symbol">+</span>
              </div>
              <h2 className="create-card-title">Create New Space</h2>
              <p className="create-card-subtitle">Initialize spatial mapping<br />protocol</p>
            </div>

            {/* Stored Space Cards */}
            {filteredSpaces.map((space) => (
              <div 
                className="space-item-card" 
                key={space.id}
                onClick={() => setSelectedSpaceForViewer(space)}
              >
                {/* Visual Preview / CAD Blueprint */}
                <div className="space-preview-box">
                  <img
                    src={space.image}
                    alt={`${space.title} wireframe schematic`}
                    className="space-preview-img"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="preview-overlay-grid" />
                  <div className="badge-synced">SYNCED</div>
                  <div className="badge-filesize">⟳ {space.size}</div>
                </div>

                {/* Info / Metadata Container */}
                <div className="space-card-body">
                  <div className="space-code-row">
                    <span className="space-code-text">{space.code}</span>
                    <div className="menu-container" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="space-menu-btn" 
                        aria-label="Space options"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === space.id ? null : space.id);
                        }}
                      >
                        ⋮
                      </button>

                      {activeMenuId === space.id && (
                        <div className="dropdown-action-menu">
                          <button onClick={(e) => handleDuplicateSpace(space, e)}>
                            📋 Duplicate Space
                          </button>
                          <button onClick={(e) => handleExportSpace(space, e)}>
                            📥 Export Telemetry (.json)
                          </button>
                          <button 
                            className="danger-item" 
                            onClick={(e) => handleDeleteSpace(space.id, e)}
                          >
                            🗑️ Delete from Stored Work
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="space-title-heading">
                    {space.title.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        {line}
                        {idx < space.title.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </h3>

                  <div className="space-meta-details">
                    <span className="meta-item">⬖ {String(space.floorCount).padStart(2, '0')} FLOORS</span>
                    <span className="meta-item">◫ {space.roomCount} ROOMS</span>
                    <span className="meta-item">📍 {space.poiCount} POIs</span>
                  </div>

                  <div className="space-card-footer">
                    <div className="status-ready-tag">
                      <span className="ready-dot" />
                      <span>{space.status}</span>
                    </div>
                    <button 
                      className="view-model-link" 
                      title="Open 3D Model Explorer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpaceForViewer(space);
                      }}
                    >
                      VIEW MODEL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Bottom System Status Bar */}
        <footer className="workspace-system-footer">
          <div className="footer-sys-left">
            <span className="system-version-highlight">NAMMA_SYSTEM_V.2.4.0_STABLE</span>
          </div>
          <div className="footer-sys-right">
            <span className="footer-item">
              System Health: <strong className="text-mint">100%</strong>
            </span>
            <span className="footer-item">Privacy</span>
            <span className="footer-item">
              Latency: <strong className="text-white">14ms</strong>
            </span>
          </div>
        </footer>
      </div>

      {/* Initialize Spatial Mapping Protocol Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <span className="modal-badge">INITIALIZE PROTOCOL</span>
                <h2 className="modal-title">Create New Spatial Digital Twin</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setIsCreateModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSpace} className="modal-form">
              <div className="form-group">
                <label className="form-label">SPACE / FACILITY NAME</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. CYBERNETICS LAB 04"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">FLOOR COUNT</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    className="form-input"
                    value={newSpaceFloors}
                    onChange={(e) => setNewSpaceFloors(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">ESTIMATED ROOMS</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    className="form-input"
                    value={newSpaceRooms}
                    onChange={(e) => setNewSpaceRooms(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">CAPTURE INGESTION SOURCE</label>
                <div className="capture-modes-grid">
                  <div 
                    className={`capture-mode-box ${captureMethod === 'video' ? 'active' : ''}`}
                    onClick={() => setCaptureMethod('video')}
                  >
                    <span className="mode-icon">📹</span>
                    <strong>Smartphone Video</strong>
                    <small>Neural Photogrammetry 4K</small>
                  </div>
                  <div 
                    className={`capture-mode-box ${captureMethod === 'lidar' ? 'active' : ''}`}
                    onClick={() => setCaptureMethod('lidar')}
                  >
                    <span className="mode-icon">📡</span>
                    <strong>LiDAR Spatial Scan</strong>
                    <small>Point Cloud (.ply, .e57)</small>
                  </div>
                </div>
              </div>

              <div className="modal-actions-row">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  className="btn-scan-launch"
                  onClick={() => {
                    handleCreateSpace({ preventDefault: () => {} } as unknown as React.FormEvent);
                    onNavigateScan?.();
                  }}
                  title="Save and launch live camera AR photogrammetry scan"
                >
                  📷 LAUNCH CAMERA SCAN
                </button>
                <button type="submit" className="btn-confirm-create">
                  INITIALIZE RECONSTRUCTION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive 3D Digital Twin Viewer Modal */}
      {selectedSpaceForViewer && (
        <div className="modal-backdrop" onClick={() => setSelectedSpaceForViewer(null)}>
          <div className="viewer-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="viewer-modal-header">
              <div className="viewer-title-info">
                <span className="badge-synced">LIVE DIGITAL TWIN</span>
                <h2>{selectedSpaceForViewer.title.replace('\n', ' ')} [{selectedSpaceForViewer.code}]</h2>
                <p>{selectedSpaceForViewer.subtitle} &bull; Reconstruction Quality: <b style={{color: '#38e5ad'}}>{selectedSpaceForViewer.quality}</b></p>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedSpaceForViewer(null)}>✕</button>
            </div>

            <div className="viewer-3d-stage">
              <img 
                src={selectedSpaceForViewer.image} 
                alt="3D CAD Blueprint" 
                className="viewer-blueprint-preview"
              />
              <div className="viewer-hud-overlay">
                <div className="hud-telemetry-panel">
                  <div className="hud-metric-row"><span>STRUCTURE:</span> <b>NOMINAL</b></div>
                  <div className="hud-metric-row"><span>ACTIVE POIs:</span> <b>{selectedSpaceForViewer.poiCount}</b></div>
                  <div className="hud-metric-row"><span>FLOOR LEVELS:</span> <b>{selectedSpaceForViewer.floorCount}</b></div>
                  <div className="hud-metric-row"><span>DATA FOOTPRINT:</span> <b>{selectedSpaceForViewer.size}</b></div>
                </div>
                <div className="hud-controls-hint">
                  <span>[⛶ MOUSE ROTATE / ORBIT 360°]</span>
                  <span>[⚙ WIRED ISOMETRIC VIEW]</span>
                </div>
              </div>
            </div>

            <div className="viewer-modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedSpaceForViewer(null)}>CLOSE VIEWER</button>
              <button className="btn-primary" onClick={() => alert(`Entering interactive edit session for ${selectedSpaceForViewer.code}`)}>
                LAUNCH FULL 3D CANVAS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

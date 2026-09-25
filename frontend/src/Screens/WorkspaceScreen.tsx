import React, { useState, useEffect, useMemo } from 'react';
import './WorkspaceScreen.css';
import { listRecordedVideos, getRecordedVideo, type StoredScanVideo } from '../videoStorage';

// SVG Icons matching the tactical spatial design language
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
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
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
      <circle cx="18" cy="4" r="3" fill="#ff5a1f" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.79-1.81.79-1.81l-1.98-1.98s-1.1.08-1.81.79z" />
      <path d="M15 8s-4-4-9-1l6 6c3 5 7 1 7 1z" />
      <path d="M12 15l-3-3" />
      <path d="M14 4l6 6" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}

function TelemetryIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
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
  syncTime: string;
  latLon: string;
  image: string;
  quality: string;
  createdAt: string;
  pipelineBadge?: string;
  actionText?: string;
  actionType?: 'telemetry' | 'wayfinding' | 'inspect';
  videoUrl?: string;
}

const DEFAULT_STORED_SPACES: StoredSpaceItem[] = [
  {
    id: 'space-research-014',
    code: 'SPACE_014',
    title: 'RESEARCH CENTRE',
    subtitle: 'Facility Alpha Bio-Physics Core',
    floorCount: 3,
    roomCount: 48,
    poiCount: 126,
    size: '1.2 GB',
    status: '3D MESH READY',
    pipelineBadge: '(NeRF & 3DGS)',
    syncTime: '42ms Sync',
    latLon: 'LAT: 12.9716° N • LON: 77.5946° E',
    image: '/assets/research_centre.jpg',
    quality: '99.4%',
    createdAt: '2026-09-04',
    actionText: 'TELEMETRY',
    actionType: 'telemetry',
  },
  {
    id: 'space-logistics-021',
    code: 'SPACE_021',
    title: 'LOGISTICS HUB',
    subtitle: 'Automated Cargo & Distribution Hangar',
    floorCount: 4,
    roomCount: 32,
    poiCount: 34,
    size: '840 MB',
    status: 'SPATIAL MODEL READY',
    pipelineBadge: '',
    syncTime: '18ms Sync',
    latLon: 'LAT: 13.0827° N • LON: 80.2707° E',
    image: '/assets/logistics_hub.jpg',
    quality: '97.8%',
    createdAt: '2026-09-05',
    actionText: 'WAYFINDING',
    actionType: 'wayfinding',
  },
  {
    id: 'space-tower-008',
    code: 'SPACE_008',
    title: 'HEADQUARTERS TOWER',
    subtitle: 'Apex Complex Multi-Tier Atrium',
    floorCount: 5,
    roomCount: 56,
    poiCount: 24,
    size: '1.8 GB',
    status: 'POINT CLOUD & MESH READY',
    pipelineBadge: '',
    syncTime: '28ms Sync',
    latLon: 'LAT: 17.3850° N • LON: 78.4867° E',
    image: '/assets/tower_hq.jpg',
    quality: '98.6%',
    createdAt: '2026-09-07',
    actionText: 'INSPECT CLOUD',
    actionType: 'inspect',
  },
];

interface ActivityLogItem {
  id: string;
  title: string;
  subtitle: string;
  operatorInitials: string;
  operatorName: string;
  pipeline: string;
  payloadSize: string;
  confidence: string;
  status: 'Completed' | 'Processing' | 'Failed';
  type: 'scan' | 'export' | 'calibration';
}

const INITIAL_ACTIVITY_LOGS: ActivityLogItem[] = [
  {
    id: 'act-1',
    title: 'Atrium Main Wing LiDAR Scan',
    subtitle: 'Finished 18m ago • Research Centre (SPACE_014)',
    operatorInitials: 'DV',
    operatorName: 'Operator Dev',
    pipeline: '3DGS Reconstructed',
    payloadSize: '1.4 GB',
    confidence: '99.1%',
    status: 'Completed',
    type: 'scan',
  },
  {
    id: 'act-2',
    title: 'Floor 2 Executive Suite 4K Walkthrough',
    subtitle: 'Finished 2h ago • HQ Tower (SPACE_008)',
    operatorInitials: 'AL',
    operatorName: 'Arch Labs Dot',
    pipeline: 'NeRF Mesh (Instant-NGP)',
    payloadSize: '820 MB',
    confidence: '97.8%',
    status: 'Completed',
    type: 'scan',
  },
  {
    id: 'act-3',
    title: 'Logistics Hub Bay 04 Drone Video Ingest',
    subtitle: 'Finished 5h ago • Logistics Hub (SPACE_021)',
    operatorInitials: 'DP',
    operatorName: 'Drone Pilot 09',
    pipeline: 'Gaussian Splatting (3DGS)',
    payloadSize: '2.1 GB',
    confidence: '98.4%',
    status: 'Completed',
    type: 'scan',
  },
  {
    id: 'act-4',
    title: 'Headquarters Facade Aerial Scan',
    subtitle: 'Completed yesterday • HQ Tower (SPACE_008)',
    operatorInitials: 'ST',
    operatorName: 'Spatial Surveyor Team',
    pipeline: 'Point Cloud Synced (LAS/E57)',
    payloadSize: '3.4 GB',
    confidence: '96.5%',
    status: 'Completed',
    type: 'export',
  },
];

const LOCAL_STORAGE_KEY = 'namma_stored_spaces_v5';

interface WorkspaceScreenProps {
  onNavigateHome?: () => void;
  onNavigateScan?: () => void;
}

export default function WorkspaceScreen({ onNavigateHome, onNavigateScan }: WorkspaceScreenProps) {
  const [activeTab, setActiveTab] = useState<'workspace' | 'analytics' | 'capture' | 'twins' | 'telemetry' | 'docs'>('workspace');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'detailed'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSpaceForViewer, setSelectedSpaceForViewer] = useState<StoredSpaceItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Recorded scans from videoStorage
  const [recordedScanVideos, setRecordedScanVideos] = useState<StoredScanVideo[]>([]);
  const [activePlaybackUrl, setActivePlaybackUrl] = useState<string | null>(null);

  // Form states for creating new space
  const [newSpaceName, setNewSpaceName] = useState('');
  const [newSpaceFloors, setNewSpaceFloors] = useState('02');
  const [newSpaceRooms, setNewSpaceRooms] = useState('20');
  const [captureMethod, setCaptureMethod] = useState<'photos' | 'video' | 'lidar'>('photos');

  // Activity log states
  const [activityTab, setActivityTab] = useState<'all' | 'scans' | 'exports' | 'calibration'>('all');
  const [activitySearch, setActivitySearch] = useState('');

  // Load recorded scan videos from IndexedDB
  useEffect(() => {
    listRecordedVideos()
      .then((videos) => {
        if (Array.isArray(videos)) {
          setRecordedScanVideos(videos);
        }
      })
      .catch(() => {});
  }, []);

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

  // Aggregate telemetry stats from stored work
  const metrics = useMemo(() => {
    const totalSpaces = spaces.length + recordedScanVideos.length;
    const totalFloors = spaces.reduce((acc, s) => acc + s.floorCount, 0);
    const totalPOIs = spaces.reduce((acc, s) => acc + s.poiCount, 0);
    return {
      activeSpaces: String(totalSpaces).padStart(2, '0'),
      floors: String(totalFloors).padStart(2, '0'),
      pois: totalPOIs,
      avgQuality: '98.2%',
    };
  }, [spaces, recordedScanVideos]);

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
      subtitle: captureMethod === 'photos' ? 'Photogrammetry 4K Scan' : captureMethod === 'video' ? 'Gaussian Splatting Video Ingest' : 'LiDAR Point Cloud Mesh',
      floorCount: floorNum,
      roomCount: roomNum,
      poiCount: generatedPOIs,
      size: `${(Math.random() * 0.8 + 0.6).toFixed(1)} GB`,
      status: '3D MESH READY',
      syncTime: '24ms Sync',
      latLon: `LAT: ${(12 + Math.random()).toFixed(4)}° N • LON: ${(77 + Math.random()).toFixed(4)}° E`,
      image: captureMethod === 'photos' ? '/assets/research_centre.jpg' : captureMethod === 'video' ? '/assets/logistics_hub.jpg' : '/assets/tower_hq.jpg',
      quality: '98.9%',
      createdAt: new Date().toISOString().split('T')[0],
      actionText: 'TELEMETRY',
      actionType: 'telemetry',
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

  const handlePlayRecordedVideo = async (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const blob = await getRecordedVideo(videoId);
      if (blob) {
        const url = URL.createObjectURL(blob);
        setActivePlaybackUrl(url);
      }
    } catch {
      alert("Unable to load recorded scan video playback.");
    }
  };

  const filteredSpaces = spaces.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLogs = INITIAL_ACTIVITY_LOGS.filter((log) => {
    if (activityTab === 'scans' && log.type !== 'scan') return false;
    if (activityTab === 'exports' && log.type !== 'export') return false;
    if (activityTab === 'calibration' && log.type !== 'calibration') return false;
    if (activitySearch) {
      const q = activitySearch.toLowerCase();
      return (
        log.title.toLowerCase().includes(q) ||
        log.subtitle.toLowerCase().includes(q) ||
        log.operatorName.toLowerCase().includes(q) ||
        log.pipeline.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
            <span className="brand-logo-icon">NS</span>
            <div className="brand-text-block">
              <span className="brand-title">NAMMA SPACE</span>
              <span className="brand-sub">SPATIAL INTEL v2.4</span>
            </div>
            <span className="brand-live-dot" title="System Operational" />
          </button>
        </div>

        {/* Navigation Group Header */}
        <div className="nav-group-label">NAVIGATION</div>

        {/* Main Nav Items */}
        <nav className="sidebar-nav" aria-label="Main Sections">
          <button
            className={`sidebar-nav-item ${activeTab === 'workspace' ? 'active' : ''}`}
            onClick={() => setActiveTab('workspace')}
          >
            <span className="nav-icon"><WorkspaceGridIcon /></span>
            <span className="nav-text">Workspace</span>
            <span className="active-green-dot" />
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <span className="nav-icon"><AnalyticsIcon /></span>
            <span className="nav-text">Analytics</span>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'capture' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('capture');
              onNavigateScan?.();
            }}
          >
            <span className="nav-icon"><CaptureIcon /></span>
            <span className="nav-text">Capture & Sensors</span>
            <span className="nav-badge-pill green">42 Live</span>
          </button>

          <button
            className={`sidebar-nav-item ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            <span className="nav-icon"><DocIcon /></span>
            <span className="nav-text">Documentation</span>
          </button>
        </nav>

        {/* Active Node Info Card */}
        <div className="active-node-box">
          <div className="node-status-row">
            <span className="node-label">ACTIVE NODE</span>
            <span className="node-pill">STABLE</span>
          </div>
          <div className="node-mesh-id">Cluster EPSG_3857</div>
          <div className="node-accuracy">±0.4cm</div>
        </div>

        {/* Bottom Profile Footer */}
        <div className="sidebar-profile-footer">
          <div className="sidebar-ping-row">
            <span className="ping-dot" />
            <span>Health: 100%</span>
            <span className="ping-ms">14ms ping</span>
          </div>
          <div className="operator-card">
            <div className="operator-avatar">OP1</div>
            <div className="operator-info">
              <span className="operator-id">OPERATOR_01</span>
              <span className="operator-role">Spatial Lead</span>
            </div>
            <div className="operator-actions">
              <button className="icon-btn-tiny" title="Settings">⚙</button>
              <button className="icon-btn-tiny" title="Help">?</button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Body */}
      <div className="workspace-main-wrapper">
        {/* Top Bar Navigation */}
        <header className="workspace-topbar">
          <div className="topbar-left-breadcrumbs">
            <span className="breadcrumb-brand"><HexagonLogoIcon /> WORKSPACE</span>
            <span className="breadcrumb-slash">/</span>
            <span className="breadcrumb-sub">SPATIAL OPERATIONS</span>
            <span className="system-op-badge">
              <span className="op-green-dot" />
              SYSTEM OPERATIONAL
            </span>
          </div>

          <div className="topbar-center-search">
            <span className="search-icon"><SearchIcon /></span>
            <input
              type="text"
              className="topbar-search-input"
              placeholder="Search coordinates, spaces, POIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="topbar-right-actions">
            <button className="topbar-action-icon" title="Filter Controls"><SlidersIcon /></button>
            <button className="topbar-action-icon" title="Signal Stream"><BroadcastIcon /></button>
            <button className="topbar-action-icon" title="Notifications"><BellIcon /></button>

            <button className="btn-light-tactical" onClick={() => alert("Batch Syncing all spatial datasets...")}>
              <RefreshIcon /> Batch Sync
            </button>
            <button className="btn-dark-green" onClick={() => onNavigateScan?.()}>
              <PlusIcon /> New Capture
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="workspace-content-area" onClick={() => setActiveMenuId(null)}>
          {/* View Filter Pill Bar */}
          <div className="workspace-filter-tabs-row">
            <div className="filter-pills-left">
              <button className="pill-tab active">
                <span className="pill-active-dot" />
                ACTIVE SPACES
              </button>
              <button className="pill-tab">
                <span className="pill-symbol">🔍</span>
                SCAN & INGESTION HISTORY
                <span className="pill-new-badge">4 NEW</span>
              </button>
            </div>

            <div className="view-mode-toggle-group">
              <span className="view-mode-label">VIEW MODE:</span>
              <div className="mode-segmented-control">
                <button 
                  className={`segment-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <span className="icon-grid-blocks">⬫</span>
                </button>
                <button 
                  className={`segment-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <span>☰</span>
                </button>
                <button 
                  className={`segment-btn ${viewMode === 'detailed' ? 'active' : ''}`}
                  onClick={() => setViewMode('detailed')}
                  title="Detailed View"
                >
                  <span>⚏</span>
                </button>
              </div>
            </div>
          </div>

          {/* Title and Top Metrics Header */}
          <div className="workspace-title-header">
            <div className="title-breadcrumb-meta">
              SPATIAL OPERATIONS &nbsp; <span className="mesh-code">COORDINATE MESH: EP56_3857</span>
            </div>

            <h1 className="workspace-main-title">YOUR SPATIAL WORKSPACE</h1>

            <div className="header-action-toolbar">
              {/* Metrics Row Pills */}
              <div className="workspace-metrics-row">
                <div className="metric-badge green-badge">
                  <span className="badge-dot" />
                  <strong>{metrics.activeSpaces}</strong> ACTIVE SPACES
                </div>
                <div className="metric-badge outline-badge">
                  <span className="badge-icon">⬖</span>
                  <strong>{metrics.floors}</strong> FLOORS • 18,400 m²
                </div>
                <div className="metric-badge outline-badge">
                  <span className="badge-icon">📍</span>
                  <strong>{metrics.pois}</strong> POIs MAPPED
                </div>
                <div className="metric-badge green-soft-badge">
                  <span className="badge-icon">✓</span>
                  <strong>{metrics.avgQuality}</strong> AVG RECONSTRUCTION QUALITY
                </div>
                <div className="metric-badge outline-badge">
                  <span className="badge-icon">⚙</span>
                  <strong>±0.4cm</strong> UWB ACCURACY
                </div>
              </div>

              {/* Right Action buttons */}
              <div className="header-buttons-group">
                <button className="btn-light-tactical" onClick={() => alert("Batch Sync triggered")}>
                  <RefreshIcon /> Batch Sync
                </button>
                <button className="btn-light-tactical" onClick={() => alert("Exporting all USDZ spatial archives...")}>
                  <ExportIcon /> Export All USDZ
                </button>
                <button className="btn-dark-green" onClick={() => setIsCreateModalOpen(true)}>
                  <PlusIcon /> New Capture
                </button>
              </div>
            </div>
          </div>

          {/* 4 Cards Grid Section */}
          <div className="workspace-cards-grid">
            {/* 1. Create New Space Action Card */}
            <div
              className="create-space-card"
              role="button"
              tabIndex={0}
              onClick={() => setIsCreateModalOpen(true)}
            >
              <div className="create-card-header">
                <span className="protocol-badge">PROTOCOL AUTO_INGEST_ON</span>
              </div>
              
              <div className="create-icon-box">
                <PlusIcon />
              </div>

              <h2 className="create-card-title">CREATE NEW SPACE</h2>
              <p className="create-card-subtitle">
                Initialize spatial mapping protocol & start automated photogrammetry pipeline.
              </p>

              <div className="ingest-pipelines-box">
                <div className="pipelines-label">INGEST PIPELINES:</div>
                <div className="pipeline-buttons">
                  <button 
                    className={`pipeline-btn ${captureMethod === 'photos' ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setCaptureMethod('photos'); }}
                  >
                    📷 Photos
                  </button>
                  <button 
                    className={`pipeline-btn ${captureMethod === 'video' ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setCaptureMethod('video'); }}
                  >
                    📹 Video
                  </button>
                  <button 
                    className={`pipeline-btn ${captureMethod === 'lidar' ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); setCaptureMethod('lidar'); }}
                  >
                    📡 LiDAR
                  </button>
                </div>
              </div>

              <button className="btn-light-block-full">
                Start Spatial Capture
              </button>
            </div>

            {/* Recorded Scans from IndexedDB (if any exist) */}
            {recordedScanVideos.map((video) => (
              <div 
                className="space-item-card" 
                key={video.id}
                onClick={(e) => handlePlayRecordedVideo(video.id, e)}
              >
                <div className="space-preview-box">
                  <div className="preview-top-badges">
                    <span className="badge-synced"><span className="synced-dot" /> LIVE SCAN</span>
                    <span className="badge-filesize">📹 WEBM</span>
                  </div>
                  <div className="latlon-overlay-box">
                    RECORDED SCAN VIDEO
                  </div>
                </div>
                <div className="space-card-body">
                  <span className="space-code-text">RECORDED_SCAN</span>
                  <h3 className="space-title-heading">{video.name}</h3>
                  <div className="status-ready-box">
                    <span className="status-ready-badge"><span className="ready-green-dot" /> SCAN RECORDED</span>
                  </div>
                  <div className="space-card-action-row">
                    <button className="btn-dark-green-split" onClick={(e) => handlePlayRecordedVideo(video.id, e)}>
                      ▶ PLAY SCAN
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Stored Space Cards */}
            {filteredSpaces.map((space) => (
              <div 
                className="space-item-card" 
                key={space.id}
                onClick={() => setSelectedSpaceForViewer(space)}
              >
                {/* Image Preview Canvas */}
                <div className="space-preview-box">
                  <img
                    src={space.image}
                    alt={`${space.title} schematic`}
                    className="space-preview-img"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="preview-top-badges">
                    <span className="badge-synced"><span className="synced-dot" /> SYNCED</span>
                    <span className="badge-filesize">📦 {space.size}</span>
                  </div>

                  <div className="latlon-overlay-box">
                    {space.latLon}
                  </div>
                </div>

                {/* Info Container */}
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
                            🗑️ Delete Space
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="space-title-heading">{space.title}</h3>

                  <div className="space-tags-pills-row">
                    <span className="tag-pill">⬖ {String(space.floorCount).padStart(2, '0')} FLOORS</span>
                    <span className="tag-pill">◫ {space.roomCount} ROOMS</span>
                    <span className="tag-pill">📍 {space.poiCount} POIs</span>
                  </div>

                  <div className="status-ready-box">
                    <span className="status-ready-badge">
                      <span className="ready-green-dot" />
                      {space.status} {space.pipelineBadge}
                    </span>
                    <span className="sync-latency-text">{space.syncTime}</span>
                  </div>

                  <div className="space-card-action-row">
                    <button 
                      className="btn-dark-green-split"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpaceForViewer(space);
                      }}
                    >
                      <RocketIcon /> LAUNCH VIEWER
                    </button>
                    <button 
                      className="btn-outline-split"
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`Opening ${space.actionText || 'TELEMETRY'} module...`);
                      }}
                    >
                      {space.actionType === 'wayfinding' && <CompassIcon />}
                      {space.actionType === 'inspect' && <CloudIcon />}
                      {space.actionType === 'telemetry' && <TelemetryIcon />}
                      {space.actionText || 'TELEMETRY'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Middle Section: Engine & Hardware Workload Cards */}
          <div className="engine-status-panel">
            {/* Card 1: Neural Engine Workload */}
            <div className="engine-card">
              <div className="engine-card-header">
                <div className="engine-title-group">
                  <span className="engine-icon">🧠</span>
                  <span className="engine-name">NEURAL ENGINE WORKLOAD</span>
                </div>
                <span className="status-pill green">Ready</span>
              </div>
              <div className="engine-stat-value">
                48 GB / 64 GB <span className="stat-sub font-mono">75% VRAM Allocated</span>
              </div>
              <div className="workload-progress-track">
                <div className="workload-progress-fill" style={{ width: '75%' }} />
              </div>
              <div className="engine-card-footer font-mono">
                <span>Reconstruction Queue: 0 pending</span>
                <span>Throughput: 142 fps</span>
              </div>
            </div>

            {/* Card 2: UWB Sensor Mesh */}
            <div className="engine-card">
              <div className="engine-card-header">
                <div className="engine-title-group">
                  <span className="engine-icon">📡</span>
                  <span className="engine-name">UWB SENSOR MESH</span>
                </div>
                <span className="status-pill beige-green">Connected (42 Nodes)</span>
              </div>
              <div className="engine-stat-value sparkline-row">
                <span>14 ms</span> <span className="stat-sub">Mesh Ping Latency</span>
                <svg className="sparkline-chart" viewBox="0 0 100 24" fill="none">
                  <path d="M0 16 L20 12 L40 18 L60 8 L80 14 L100 10" stroke="#1e4d3b" strokeWidth="2" fill="none" />
                </svg>
              </div>
              <div className="engine-card-footer font-mono">
                <span>Packet Loss: 0.00%</span>
                <span>Anchor Drift: ±0.4cm</span>
              </div>
            </div>

            {/* Card 3: Splat Ingestion Engine */}
            <div className="engine-card">
              <div className="engine-card-header">
                <div className="engine-title-group">
                  <span className="engine-icon">🧊</span>
                  <span className="engine-name">SPLAT INGESTION ENGINE</span>
                </div>
                <span className="version-tag">v4.1.2</span>
              </div>
              <div className="splat-stat-box">
                <div className="splat-icon-circle">00</div>
                <div className="splat-info">
                  <strong>Gaussian Splatting Ingest</strong>
                  <span>Real-time point-to-mesh refinement active</span>
                </div>
              </div>
              <div className="engine-card-footer font-mono">
                <button className="link-btn-telemetry" onClick={() => alert("Opening Telemetry Hooks")}>
                  Configure Telemetry Hooks ➔
                </button>
                <span>Auto-backup: 5m ago</span>
              </div>
            </div>
          </div>

          {/* Bottom Activity & Scan History Log Section */}
          <div className="activity-history-panel">
            <div className="activity-panel-header">
              <div className="activity-title-group">
                <span className="activity-icon font-mono">◫</span>
                <div className="activity-title-wrap">
                  <div className="title-row font-mono">
                    <h2 className="activity-heading">ACTIVITY & SCAN HISTORY</h2>
                    <span className="realtime-log-badge">Real-Time Log</span>
                  </div>
                  <p className="activity-sub">
                    Live audit of 3D photogrammetry, Gaussian splatting captures, mesh exports & telemetry syncs.
                  </p>
                </div>
              </div>

              <div className="activity-controls">
                <div className="activity-search-box">
                  <span className="search-icon"><SearchIcon /></span>
                  <input
                    type="text"
                    className="activity-search-input"
                    placeholder="Filter scans, tags, operators..."
                    value={activitySearch}
                    onChange={(e) => setActivitySearch(e.target.value)}
                  />
                </div>

                <div className="date-select-dropdown">
                  <span>📅 Today (Last 24h)</span>
                  <span className="arrow-down">▾</span>
                </div>

                <button className="btn-dark-green-sm" onClick={() => alert("Exporting Activity Log CSV...")}>
                  <ExportIcon /> Export CSV
                </button>
              </div>
            </div>

            {/* Filter Tabs Sub-bar */}
            <div className="activity-tabs-bar">
              <div className="tabs-left">
                <button 
                  className={`tab-btn ${activityTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActivityTab('all')}
                >
                  All Events (42)
                </button>
                <button 
                  className={`tab-btn ${activityTab === 'scans' ? 'active' : ''}`}
                  onClick={() => setActivityTab('scans')}
                >
                  📷 Scans & Captures (18)
                </button>
                <button 
                  className={`tab-btn ${activityTab === 'exports' ? 'active' : ''}`}
                  onClick={() => setActivityTab('exports')}
                >
                  📤 Model Exports (12)
                </button>
                <button 
                  className={`tab-btn ${activityTab === 'calibration' ? 'active' : ''}`}
                  onClick={() => setActivityTab('calibration')}
                >
                  📡 Sensor Calibration (12)
                </button>
              </div>

              <div className="sync-status-indicator font-mono">
                <span className="sync-dot" /> Auto-syncing every 10s
              </div>
            </div>

            {/* Table */}
            <div className="activity-table-wrapper">
              <table className="activity-data-table">
                <thead>
                  <tr>
                    <th>CAPTURE & TARGET</th>
                    <th>OPERATOR</th>
                    <th>PROCESSING PIPELINE</th>
                    <th>PAYLOAD SIZE</th>
                    <th>CONFIDENCE</th>
                    <th>STATUS</th>
                    <th className="align-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <div className="capture-target-cell">
                          <span className="table-icon-bg">⬡</span>
                          <div className="cell-text font-mono">
                            <span className="cell-title font-sans">{log.title}</span>
                            <span className="cell-sub">{log.subtitle}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="operator-chip">
                          <span className="op-initials">{log.operatorInitials}</span>
                          <span className="op-name font-mono">{log.operatorName}</span>
                        </div>
                      </td>
                      <td>
                        <span className="pipeline-tag">{log.pipeline}</span>
                      </td>
                      <td className="font-mono">{log.payloadSize}</td>
                      <td>
                        <span className="confidence-pill font-mono">🟢 {log.confidence}</span>
                      </td>
                      <td>
                        <span className="table-status-completed font-mono">● {log.status}</span>
                      </td>
                      <td className="align-right">
                        <div className="table-action-btns">
                          <button className="btn-table-action" onClick={() => alert(`Inspecting ${log.title}...`)}>
                            👁 Inspect
                          </button>
                          <button className="btn-table-icon" title="Download Log">📥</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="table-footer-pagination">
              <span className="showing-text font-mono">Showing 4 of 42 spatial events</span>
              <div className="pagination-controls font-mono">
                <button className="page-nav-btn">Previous</button>
                <button className="page-num active">1</button>
                <button className="page-num">2</button>
                <button className="page-num">3</button>
                <button className="page-nav-btn">Next</button>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom System Status Bar */}
        <footer className="workspace-system-footer font-mono">
          <div className="footer-sys-left">
            <span className="footer-status-dot" />
            <span>System Health: <strong className="text-forest">100%</strong></span>
            <span className="footer-sep">|</span>
            <span>Privacy & Telemetry</span>
            <span className="footer-sep">|</span>
            <span>Latency: <strong>14ms</strong></span>
          </div>
          <div className="footer-sys-right">
            <span>NAMMA_SYSTEM_V.2.4.0_STABLE</span>
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

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label font-mono">ESTIMATED FLOORS</label>
                  <input
                    type="number"
                    className="form-input font-mono"
                    value={newSpaceFloors}
                    onChange={(e) => setNewSpaceFloors(e.target.value)}
                    min="1"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label font-mono">ROOMS / SECTORS</label>
                  <input
                    type="number"
                    className="form-input font-mono"
                    value={newSpaceRooms}
                    onChange={(e) => setNewSpaceRooms(e.target.value)}
                    min="1"
                    max="500"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">CAPTURE METHOD</label>
                <div className="capture-method-selector">
                  <button
                    type="button"
                    className={`method-option ${captureMethod === 'photos' ? 'selected' : ''}`}
                    onClick={() => setCaptureMethod('photos')}
                  >
                    <span className="method-icon">📷</span>
                    <span className="method-name">Photos (4K)</span>
                  </button>
                  <button
                    type="button"
                    className={`method-option ${captureMethod === 'video' ? 'selected' : ''}`}
                    onClick={() => setCaptureMethod('video')}
                  >
                    <span className="method-icon">📹</span>
                    <span className="method-name">Video Stream</span>
                  </button>
                  <button
                    type="button"
                    className={`method-option ${captureMethod === 'lidar' ? 'selected' : ''}`}
                    onClick={() => setCaptureMethod('lidar')}
                  >
                    <span className="method-icon">📡</span>
                    <span className="method-name">LiDAR Mesh</span>
                  </button>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  CANCEL
                </button>
                <button type="submit" className="btn-submit">
                  INITIALIZE MAPPING PROTOCOL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3D Model Viewer Modal or Video Playback Modal */}
      {(selectedSpaceForViewer || activePlaybackUrl) && (
        <div className="modal-backdrop" onClick={() => { setSelectedSpaceForViewer(null); setActivePlaybackUrl(null); }}>
          <div className="viewer-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="viewer-header">
              <div className="viewer-info font-mono">
                <span className="viewer-code">{selectedSpaceForViewer ? selectedSpaceForViewer.code : 'RECORDED_SCAN'}</span>
                <span className="viewer-title font-sans">{selectedSpaceForViewer ? selectedSpaceForViewer.title : 'Live Video Playback'}</span>
                <span className="viewer-status font-mono">● {selectedSpaceForViewer ? selectedSpaceForViewer.status : 'VIDEO READY'}</span>
              </div>
              <button className="modal-close-btn" onClick={() => { setSelectedSpaceForViewer(null); setActivePlaybackUrl(null); }}>
                ✕
              </button>
            </div>

            <div className="viewer-body">
              {activePlaybackUrl ? (
                <video src={activePlaybackUrl} controls autoPlay className="viewer-main-img" />
              ) : (
                <img 
                  src={selectedSpaceForViewer?.image} 
                  alt={selectedSpaceForViewer?.title} 
                  className="viewer-main-img" 
                />
              )}
              {selectedSpaceForViewer && (
                <div className="viewer-overlay-hud font-mono">
                  <div className="hud-line">RECONSTRUCTION QUALITY: {selectedSpaceForViewer.quality}</div>
                  <div className="hud-line">FLOORS: {selectedSpaceForViewer.floorCount} | ROOMS: {selectedSpaceForViewer.roomCount} | POIs: {selectedSpaceForViewer.poiCount}</div>
                  <div className="hud-line">{selectedSpaceForViewer.latLon}</div>
                </div>
              )}
            </div>

            <div className="viewer-footer font-mono">
              <span>{selectedSpaceForViewer ? `SIZE: ${selectedSpaceForViewer.size}` : 'PLAYBACK ACTIVE'}</span>
              <button className="btn-dark-green-sm" onClick={() => alert("Opening full 3D interactive viewer...")}>
                🚀 LAUNCH FULLSCREEN 3D ENGINE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

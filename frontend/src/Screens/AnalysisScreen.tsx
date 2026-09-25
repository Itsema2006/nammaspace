import React, { useState } from 'react';
import './AnalysisScreen.css';

export interface AnalysisScreenProps {
  onBackToWorkspace?: () => void;
  onExportReport?: () => void;
  onRecalibrateMesh?: () => void;
}

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  onBackToWorkspace,
  onExportReport,
  onRecalibrateMesh,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'quarter' | 'custom'>('30d');
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  const handleExport = () => {
    if (onExportReport) {
      onExportReport();
      return;
    }

    const headers = [
      "Facility Code",
      "Facility Name",
      "Floors",
      "Rooms",
      "POIs Count",
      "UWB Anchor Nodes",
      "Reconstruction Quality",
      "Model File Size",
      "Operational Mode"
    ];

    const facilities = [
      ["SPACE_014", "Research Centre", "3 Floors", "48 Rooms", "126 POIs", "18 UWB nodes", "99.1%", "1.6 GB", "High Density 3DGS"],
      ["SPACE_021", "Logistics Hub", "4 Floors", "22 Rooms", "54 POIs", "14 UWB nodes", "98.4%", "840 MB", "Automated AGV Pathing"],
      ["SPACE_008", "Headquarters Tower", "5 Floors", "56 Rooms", "94 POIs", "10 UWB nodes", "96.5%", "1.8 GB", "Facade & Interior"]
    ];

    const rows = facilities.map((f) => f.map((col) => `"${col.replace(/"/g, '""')}"`));

    // UTF-8 BOM (\uFEFF) for Excel compatibility
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    
    link.setAttribute("href", url);
    link.setAttribute("download", `Spatial_Analytics_Facility_Matrix_${timeRange}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRecalibrate = () => {
    if (onRecalibrateMesh) {
      onRecalibrateMesh();
    } else {
      alert("Recalibrating UWB Sensor Mesh & Point Cloud Alignment... Cluster Latency: 14ms.");
    }
  };

  return (
    <div className="analysis-screen-container">
      {/* 1. Header Row */}
      <div className="analysis-header-block">
        <div className="analysis-breadcrumbs">
          <span 
            style={{ cursor: 'pointer' }} 
            onClick={onBackToWorkspace}
            title="Return to Workspace Overview"
          >
            WORKSPACE
          </span> 
          <span>/</span> 
          <span className="crumb-active">ANALYTICS</span> 
          <span>/</span> 
          <span>TELEMETRY & EFFICIENCY</span>
        </div>

        <div className="analysis-title-row">
          <div className="analysis-title-left">
            <h1 className="analysis-main-heading">
              SPATIAL ANALYTICS & RECONSTRUCTION INTELLIGENCE
            </h1>
            <span className="latency-pill-badge">
              CLUSTER_LATENCY: 14MS
            </span>
          </div>

          <div className="analysis-header-right-controls">
            {/* Time Filter Segmented Buttons */}
            <div className="time-range-segmented" role="group" aria-label="Time period selection">
              <button
                className={`time-range-btn ${timeRange === '7d' ? 'active' : ''}`}
                onClick={() => setTimeRange('7d')}
              >
                Last 7 Days
              </button>
              <button
                className={`time-range-btn ${timeRange === '30d' ? 'active' : ''}`}
                onClick={() => setTimeRange('30d')}
              >
                Last 30 Days
              </button>
              <button
                className={`time-range-btn ${timeRange === 'quarter' ? 'active' : ''}`}
                onClick={() => setTimeRange('quarter')}
              >
                Last Quarter
              </button>
              <button
                className={`time-range-btn ${timeRange === 'custom' ? 'active' : ''}`}
                onClick={() => setTimeRange('custom')}
              >
                Custom
              </button>
            </div>

            {/* Action Buttons */}
            <div className="analysis-action-btn-group">
              <button className="btn-analysis-outline" onClick={handleExport}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export (CSV/PDF)
              </button>
              <button className="btn-analysis-primary" onClick={handleRecalibrate}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
                Recalibrate Mesh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top 4 KPI Metrics Grid */}
      <div className="analysis-kpi-grid">
        {/* Card 1: Spatial Coverage & Area */}
        <div className="kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-title-label">SPATIAL COVERAGE & AREA</span>
            <div className="kpi-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-val">18,400 m²</span>
            <span className="kpi-badge green">+12.4%</span>
          </div>
          <div className="kpi-sub-text">Across 3 facilities, 12 floors</div>
        </div>

        {/* Card 2: Reconstruction Rate */}
        <div className="kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-title-label">RECONSTRUCTION RATE</span>
            <div className="kpi-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-val">142 fps</span>
            <span className="kpi-badge blue">3DGS Render</span>
          </div>
          <div className="kpi-sub-text">18 scans ingested in 24h</div>
        </div>

        {/* Card 3: Point Cloud Density */}
        <div className="kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-title-label">POINT CLOUD DENSITY</span>
            <div className="kpi-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="5" cy="5" r="1.5" />
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="19" cy="5" r="1.5" />
                <circle cx="5" cy="12" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="19" cy="12" r="1.5" />
                <circle cx="5" cy="19" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
                <circle cx="19" cy="19" r="1.5" />
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-val">48.6M</span>
            <span className="kpi-secondary-inline">2,660 pts/m²</span>
          </div>
          <div className="kpi-sub-text">99.2% reconstruction confidence</div>
        </div>

        {/* Card 4: Sensor Mesh Uptime */}
        <div className="kpi-card">
          <div className="kpi-card-top">
            <span className="kpi-title-label">SENSOR MESH UPTIME</span>
            <div className="kpi-icon-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-main-val">99.98%</span>
            <span className="kpi-badge green">±0.4cm drift</span>
          </div>
          <div className="kpi-sub-text">42 UWB anchors active (14ms)</div>
        </div>
      </div>

      {/* 3. Main Charts & Compute Section (2 Columns) */}
      <div className="analysis-charts-row">
        {/* Left Panel: Spatial Ingestion & Reconstruction Volume */}
        <div className="chart-panel-card">
          <div className="panel-header-row">
            <div className="panel-title-block">
              <h2 className="panel-main-title">Spatial Ingestion & Reconstruction Volume</h2>
              <p className="panel-subtitle">30-day cumulative intake breakdown by modal sensor pipeline</p>
            </div>

            <div className="legend-group">
              <div className="legend-item"><span className="legend-box gs" /> 3DGS</div>
              <div className="legend-item"><span className="legend-box lidar" /> LiDAR</div>
              <div className="legend-item"><span className="legend-box photo" /> Photogrammetry</div>
            </div>
          </div>

          {/* Visualization Container with stacked bars & SVG wave curve */}
          <div className="bar-chart-visualization-container">
            {/* Smooth SVG Trend Line Overlay */}
            <svg className="svg-chart-overlay" viewBox="0 0 600 170" preserveAspectRatio="none">
              <path
                d="M 20 130 Q 80 110, 120 70 T 220 90 T 320 40 T 420 20 T 520 50 T 580 30"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="580" cy="30" r="5" fill="#34d399" stroke="#0f172a" strokeWidth="2" />
            </svg>

            {/* Stacked Bars Row */}
            <div className="bars-flex-layout">
              {/* Day 01 */}
              <div className="bar-column">
                <div className="stacked-bar" style={{ height: '110px' }}>
                  <div className="bar-segment photo" style={{ height: '35px' }} />
                  <div className="bar-segment lidar" style={{ height: '40px' }} />
                  <div className="bar-segment gs" style={{ height: '35px' }} />
                </div>
                <span className="bar-date-label">DAY 01</span>
              </div>

              {/* Day 05 */}
              <div className="bar-column">
                <div className="stacked-bar" style={{ height: '135px' }}>
                  <div className="bar-segment photo" style={{ height: '45px' }} />
                  <div className="bar-segment lidar" style={{ height: '45px' }} />
                  <div className="bar-segment gs" style={{ height: '45px' }} />
                </div>
                <span className="bar-date-label">DAY 05</span>
              </div>

              {/* Day 10 */}
              <div className="bar-column">
                <div className="stacked-bar" style={{ height: '120px' }}>
                  <div className="bar-segment photo" style={{ height: '30px' }} />
                  <div className="bar-segment lidar" style={{ height: '40px' }} />
                  <div className="bar-segment gs" style={{ height: '50px' }} />
                </div>
                <span className="bar-date-label">DAY 10</span>
              </div>

              {/* Day 15 */}
              <div className="bar-column">
                <div className="stacked-bar" style={{ height: '145px' }}>
                  <div className="bar-segment photo" style={{ height: '40px' }} />
                  <div className="bar-segment lidar" style={{ height: '50px' }} />
                  <div className="bar-segment gs" style={{ height: '55px' }} />
                </div>
                <span className="bar-date-label">DAY 15</span>
              </div>

              {/* Day 20 */}
              <div className="bar-column">
                <div className="stacked-bar" style={{ height: '160px' }}>
                  <div className="bar-segment photo" style={{ height: '50px' }} />
                  <div className="bar-segment lidar" style={{ height: '55px' }} />
                  <div className="bar-segment gs" style={{ height: '55px' }} />
                </div>
                <span className="bar-date-label">DAY 20</span>
              </div>

              {/* Day 25 */}
              <div className="bar-column">
                <div className="stacked-bar" style={{ height: '150px' }}>
                  <div className="bar-segment photo" style={{ height: '45px' }} />
                  <div className="bar-segment lidar" style={{ height: '45px' }} />
                  <div className="bar-segment gs" style={{ height: '60px' }} />
                </div>
                <span className="bar-date-label">DAY 25</span>
              </div>

              {/* TODAY */}
              <div className="bar-column">
                <div className="stacked-bar" style={{ height: '168px' }}>
                  <div className="bar-segment photo" style={{ height: '45px' }} />
                  <div className="bar-segment lidar" style={{ height: '58px' }} />
                  <div className="bar-segment gs" style={{ height: '65px' }} />
                </div>
                <span className="bar-date-label" style={{ color: '#34d399' }}>TODAY</span>
              </div>
            </div>
          </div>

          <div className="chart-bottom-breakdown">
            <span className="breakdown-label">Spatial Load Distribution:</span>
            <div className="breakdown-item">
              <span className="breakdown-dot" style={{ backgroundColor: '#10b981' }} /> Research Centre (54%)
            </div>
            <div className="breakdown-item">
              <span className="breakdown-dot" style={{ backgroundColor: '#38bdf8' }} /> Logistics Hub (31%)
            </div>
            <div className="breakdown-item">
              <span className="breakdown-dot" style={{ backgroundColor: '#f59e0b' }} /> HQ Tower (15%)
            </div>
          </div>
        </div>

        {/* Right Panel: Hardware & Neural Compute */}
        <div className="chart-panel-card">
          <div className="panel-header-row">
            <div className="panel-title-block">
              <h2 className="panel-main-title">Hardware & Neural Compute</h2>
              <p className="panel-subtitle">Real-time tensor memory allocation and inference latency</p>
            </div>
            <span className="vram-badge-top">48 / 64 GB VRAM</span>
          </div>

          <div className="compute-metrics-row">
            <div className="compute-stat-card">
              <span className="compute-stat-label">GPU UTILIZATION</span>
              <span className="compute-stat-num">78.4%</span>
              <span className="compute-stat-sub">4x RTX 4090 Ada</span>
            </div>
            <div className="compute-stat-card">
              <span className="compute-stat-label">NEURAL INFERENCE LATENCY</span>
              <span className="compute-stat-num">2.4 ms</span>
              <span className="compute-stat-sub">Optimal band</span>
            </div>
          </div>

          {/* Area Chart visualization for compute stream */}
          <div className="area-chart-container">
            <svg width="100%" height="100%" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="computeGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 90 Q 50 110, 100 80 T 200 60 T 270 20 L 300 45 L 300 120 L 0 120 Z"
                fill="url(#computeGlow)"
              />
              <path
                d="M 0 90 Q 50 110, 100 80 T 200 60 T 270 20 L 300 45"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="270" cy="20" r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
            </svg>
          </div>

          <div className="compute-footer-row">
            <span><span className="status-active-dot" /> Pipeline: CUDA Active</span>
            <span>Queue: <span className="queue-zero-text">0 pending</span></span>
          </div>
        </div>
      </div>

      {/* 4. Facility Spatial Efficiency Matrix Panel (Table) */}
      <div className="matrix-table-panel">
        <div className="panel-header-row">
          <div className="panel-title-block">
            <h2 className="panel-main-title">Facility Spatial Efficiency Matrix</h2>
            <p className="panel-subtitle">Detailed point coverage, reconstructed spaces, and mesh footprint per active zone</p>
          </div>
          <span className="status-all-calibrated">Status: All Facilities Calibrated</span>
        </div>

        <div className="matrix-table-wrapper">
          <table className="matrix-table" aria-label="Facility Spatial Efficiency Matrix">
            <thead>
              <tr>
                <th>FACILITY & ID</th>
                <th>SPATIAL FOOTPRINT</th>
                <th>POIS & ANCHORS</th>
                <th>RECONSTRUCTION QUALITY</th>
                <th>MODEL SIZE</th>
                <th>OPERATIONAL MODE</th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr 
                onClick={() => setSelectedFacility('SPACE_014')}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div className="facility-cell">
                    <span className="facility-index-num">01</span>
                    <div className="facility-meta">
                      <span className="facility-name">Research Centre</span>
                      <span className="facility-code">SPACE_014</span>
                    </div>
                  </div>
                </td>
                <td>3 Floors, 48 Rooms</td>
                <td>
                  <strong>126 POIs</strong>
                  <br />
                  <span style={{ fontSize: '10px', color: '#64748b' }}>18 UWB nodes</span>
                </td>
                <td>
                  <div className="quality-progress-cell">
                    <span className="quality-pct">99.1%</span>
                    <div className="quality-track">
                      <div className="quality-fill" style={{ width: '99.1%' }} />
                    </div>
                  </div>
                </td>
                <td><strong>1.6 GB</strong></td>
                <td>
                  <span className="mode-tag-pill">High Density 3DGS</span>
                </td>
              </tr>

              {/* Row 2 */}
              <tr 
                onClick={() => setSelectedFacility('SPACE_021')}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div className="facility-cell">
                    <span className="facility-index-num">02</span>
                    <div className="facility-meta">
                      <span className="facility-name">Logistics Hub</span>
                      <span className="facility-code">SPACE_021</span>
                    </div>
                  </div>
                </td>
                <td>4 Floors, 22 Rooms</td>
                <td>
                  <strong>54 POIs</strong>
                  <br />
                  <span style={{ fontSize: '10px', color: '#64748b' }}>14 UWB nodes</span>
                </td>
                <td>
                  <div className="quality-progress-cell">
                    <span className="quality-pct">98.4%</span>
                    <div className="quality-track">
                      <div className="quality-fill" style={{ width: '98.4%' }} />
                    </div>
                  </div>
                </td>
                <td><strong>840 MB</strong></td>
                <td>
                  <span className="mode-tag-pill">Automated AGV Pathing</span>
                </td>
              </tr>

              {/* Row 3 */}
              <tr 
                onClick={() => setSelectedFacility('SPACE_008')}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div className="facility-cell">
                    <span className="facility-index-num">03</span>
                    <div className="facility-meta">
                      <span className="facility-name">Headquarters Tower</span>
                      <span className="facility-code">SPACE_008</span>
                    </div>
                  </div>
                </td>
                <td>5 Floors, 56 Rooms</td>
                <td>
                  <strong>94 POIs</strong>
                  <br />
                  <span style={{ fontSize: '10px', color: '#64748b' }}>10 UWB nodes</span>
                </td>
                <td>
                  <div className="quality-progress-cell">
                    <span className="quality-pct">96.5%</span>
                    <div className="quality-track">
                      <div className="quality-fill" style={{ width: '96.5%' }} />
                    </div>
                  </div>
                </td>
                <td><strong>1.8 GB</strong></td>
                <td>
                  <span className="mode-tag-pill">Facade & Interior</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Bottom 3 Widget Cards Grid */}
      <div className="analysis-bottom-grid">
        {/* Widget 1: Spatial POI Density */}
        <div className="widget-card">
          <div className="widget-header-row">
            <h3 className="widget-title">Spatial POI Density</h3>
            <span className="badge-live-telemetry">LIVE TELEMETRY</span>
          </div>
          <p className="panel-subtitle" style={{ marginTop: '-8px' }}>
            Dwell time and real-time occupant movement density across Space_014
          </p>

          <div className="radar-telemetry-box">
            <div className="radar-grid-bg" />
            <div className="glowing-node-dot" style={{ top: '30%', left: '40%' }} />
            <div className="glowing-node-dot" style={{ top: '65%', left: '70%', animationDelay: '0.5s' }} />
            <div className="glowing-node-dot" style={{ top: '45%', left: '20%', animationDelay: '1s' }} />

            <div className="radar-hud-bottom">
              <span>Research Fl. 2: Bio-Lab</span>
              <span style={{ color: '#34d399', fontWeight: 700 }}>16 Active Trajectories</span>
            </div>
          </div>

          <div className="widget-footer-pill">
            <span>Mean Dwell Time: <strong style={{ color: '#ffffff' }}>22.4 mins</strong></span>
            <span>Peak Convergence: <strong style={{ color: '#ffffff' }}>14:15 UTC</strong></span>
          </div>
        </div>

        {/* Widget 2: Anchor Signal Mesh */}
        <div className="widget-card">
          <div className="widget-header-row">
            <h3 className="widget-title">Anchor Signal Mesh</h3>
            <span className="badge-nodes-count">42 NODES</span>
          </div>
          <p className="panel-subtitle" style={{ marginTop: '-8px' }}>
            RSSI distribution and packet sync reliability across all anchor pairs
          </p>

          <div className="signal-mesh-list">
            {/* Bar 1 */}
            <div className="signal-row">
              <div className="signal-info-row">
                <span className="signal-label">Optimal Band (&gt; -65 dBm)</span>
                <span className="signal-val">36 Anchors (85.7%)</span>
              </div>
              <div className="signal-bar-track">
                <div className="signal-bar-fill optimal" style={{ width: '85.7%' }} />
              </div>
            </div>

            {/* Bar 2 */}
            <div className="signal-row">
              <div className="signal-info-row">
                <span className="signal-label">Nominal Band (-65 to -78 dBm)</span>
                <span className="signal-val">5 Anchors (11.9%)</span>
              </div>
              <div className="signal-bar-track">
                <div className="signal-bar-fill nominal" style={{ width: '11.9%' }} />
              </div>
            </div>

            {/* Bar 3 */}
            <div className="signal-row">
              <div className="signal-info-row">
                <span className="signal-label">Attenuated (&lt; -78 dBm)</span>
                <span className="signal-val">1 Anchor (2.4%)</span>
              </div>
              <div className="signal-bar-track">
                <div className="signal-bar-fill attenuated" style={{ width: '5.4%' }} />
              </div>
            </div>
          </div>

          <div className="widget-footer-pill">
            <span>Time Difference of Arrival (TDoA)</span>
            <span className="sync-locked-badge">SYNC_LOCKED</span>
          </div>
        </div>

        {/* Widget 3: Calibration Drift Log */}
        <div className="widget-card">
          <div className="widget-header-row">
            <h3 className="widget-title">Calibration Drift Log</h3>
            <span className="badge-tolerance">TOLERANCE ±1.0cm</span>
          </div>
          <p className="panel-subtitle" style={{ marginTop: '-8px' }}>
            Continuous spatial positioning drift measurements
          </p>

          <div className="drift-items-list">
            <div className="drift-item">
              <span className="drift-anchor-name"><span className="drift-dot" /> ANCHOR_014_A</span>
              <span className="drift-delta-val">+0.28 cm</span>
              <span className="drift-time-ago">0.4s ago</span>
            </div>

            <div className="drift-item">
              <span className="drift-anchor-name"><span className="drift-dot" /> ANCHOR_021_B</span>
              <span className="drift-delta-val">+0.41 cm</span>
              <span className="drift-time-ago">1.2s ago</span>
            </div>

            <div className="drift-item">
              <span className="drift-anchor-name"><span className="drift-dot" /> ANCHOR_008_C</span>
              <span className="drift-delta-val">+0.68 cm</span>
              <span className="drift-time-ago">2.1s ago</span>
            </div>
          </div>

          <button 
            className="btn-widget-action"
            onClick={() => alert("Viewing full continuous spatial positioning telemetry logs...")}
          >
            View Full Telemetry Log
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisScreen;

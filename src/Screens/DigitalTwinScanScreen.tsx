import { useState, useEffect, useRef } from 'react';
import './DigitalTwinScanScreen.css';
import { saveRecordedVideo } from '../videoStorage';

interface DigitalTwinScanScreenProps {
  onBack?: () => void;
  onFinishScan?: (spaceData: { name: string; nodes: number; keyframes: number; quality: string }) => void;
}

export default function DigitalTwinScanScreen({ onBack, onFinishScan }: DigitalTwinScanScreenProps) {
  // Device & Camera States
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRequestingCamera, setIsRequestingCamera] = useState<boolean>(false);

  // Live Timer & Telemetry
  const [seconds, setSeconds] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [spatialCoverage] = useState(87);
  const [keyframes, setKeyframes] = useState(427);
  const [spatialNodes, setSpatialNodes] = useState(1865);
  const [memoryVol] = useState(142);
  const [torchOn, setTorchOn] = useState(false);
  const [meshOn, setMeshOn] = useState(true);
  const [poiPins, setPoiPins] = useState<Array<{ x: number; y: number; id: number; label: string }>>([
    { x: 38, y: 35, id: 1, label: 'POI_01: COL_A' },
  ]);
  const [isDoneProcessing, setIsDoneProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const startVideoRecording = (stream: MediaStream) => {
    if (!('MediaRecorder' in window)) {
      setCameraError('Video recording is not supported in this browser.');
      return false;
    }

    const supportedMimeType = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
    ].find((mimeType) => MediaRecorder.isTypeSupported(mimeType));

    try {
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream, supportedMimeType ? { mimeType: supportedMimeType } : undefined);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const videoBlob = new Blob(recordedChunksRef.current, { type: recorder.mimeType || 'video/webm' });
        saveRecordedVideo(videoBlob).catch((error) => {
          console.warn('Could not save recorded video to workspace:', error);
        });
        const downloadUrl = URL.createObjectURL(videoBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = `namma-space-scan-${Date.now()}.webm`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      };
      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      return true;
    } catch (error) {
      console.warn('Video recording could not start:', error);
      setCameraError('Video recording could not start in this browser.');
      return false;
    }
  };

  // Check if device is mobile
  const checkIsMobile = () => {
    if (typeof window === 'undefined') return false;
    const userAgent = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isNarrow = window.innerWidth <= 840;
    return isMobileUA || (isTouch && isNarrow);
  };

  // Robust Camera Stream Ingestion with Multi-Tier Fallbacks
  const startCamera = async (facing: 'environment' | 'user' = 'environment'): Promise<MediaStream | null> => {
    setIsRequestingCamera(true);
    setCameraError(null);

    // Check Secure Context requirement (HTTPS or localhost)
    if (typeof window !== 'undefined' && window.isSecureContext === false && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      const err = 'Camera access requires HTTPS or localhost connection.';
      console.warn(err);
      setCameraError(err);
      setIsRequestingCamera(false);
      return null;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const err = 'Camera API (navigator.mediaDevices.getUserMedia) is not supported in this browser.';
      console.warn(err);
      setCameraError(err);
      setIsRequestingCamera(false);
      return null;
    }

    try {
      // Stop any previously running stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      let stream: MediaStream | null = null;

      // Attempt 1: Use the requested physical camera when supported.
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (err1) {
        console.warn('Requested camera direction was unavailable, trying a compatible camera:', err1);
        // Attempt 2: Compatible camera with a preferred direction.
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: facing } },
            audio: false,
          });
        } catch (err2) {
          console.warn('Attempt 2 (facingMode) failed, trying universal video: true:', err2);
          // Attempt 3: Universal video stream (works on any laptop webcam / camera device)
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      if (stream) {
        streamRef.current = stream;
        setCameraActive(true);
        setCameraError(null);
        setIsRequestingCamera(false);

        if (videoRef.current) {
          const video = videoRef.current;
          video.srcObject = stream;
          video.setAttribute('playsinline', 'true');
          video.setAttribute('webkit-playsinline', 'true');
          video.muted = true;

          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((playErr) => {
              console.warn('Auto-play blocked, waiting for user gesture:', playErr);
            });
          }
        }
      } else {
        throw new Error('No media stream returned from device');
      }
      return stream;
    } catch (err: unknown) {
      let friendlyMessage = 'Camera access error. Tap "START CAMERA" to grant permission.';
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          friendlyMessage = 'Camera permission denied. Please allow camera access in browser settings.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          friendlyMessage = 'No camera device detected on this system.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          friendlyMessage = 'Camera is in use by another application or tab.';
        } else if (err.name === 'OverconstrainedError') {
          friendlyMessage = 'Requested camera resolution/mode is not supported.';
        } else {
          friendlyMessage = err.message || friendlyMessage;
        }
      }
      console.warn('Camera initialization error:', friendlyMessage, err);
      setCameraError(friendlyMessage);
      setCameraActive(false);
      setIsRequestingCamera(false);
      return null;
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Flip Camera (Front / Rear)
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // Torch / Flashlight Toggle
  const toggleTorch = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      if (track) {
        const capabilities = (track.getCapabilities && (track.getCapabilities() as { torch?: boolean })) || {};
        if (capabilities.torch) {
          try {
            await (track as MediaStreamTrack & { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
              advanced: [{ torch: !torchOn }],
            });
          } catch (e) {
            console.warn('Torch constraint error:', e);
          }
        }
      }
    }
    setTorchOn(!torchOn);
  };

  // On Mount: Detect Device & Start Camera
  useEffect(() => {
    const isMobile = checkIsMobile();
    setIsMobileDevice(isMobile);

    return () => {
      stopCamera();
    };
  }, []);

  // Timer & Telemetry increment simulation
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setSeconds((prev) => +(prev + 0.1).toFixed(1));
      if (Math.random() > 0.6) {
        setSpatialNodes((prev) => prev + Math.floor(Math.random() * 4 + 1));
        setKeyframes((prev) => prev + 1);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = (totalSec % 60).toFixed(1);
    const mStr = String(m).padStart(2, '0');
    const sStr = totalSec % 60 < 10 ? `0${s}` : s;
    return `${mStr}:${sStr}`;
  };

  // 3D Point Cloud Particle Network Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = 75;
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      color: string;
      size: number;
      type: 'teal' | 'orange' | 'cyan';
    }> = [];

    const colors = {
      teal: '#38e5ad',
      orange: '#ff7a45',
      cyan: '#38bdf8',
    };

    for (let i = 0; i < particleCount; i++) {
      const type: 'teal' | 'orange' | 'cyan' = i % 5 === 0 ? 'orange' : i % 3 === 0 ? 'cyan' : 'teal';
      const x = (Math.random() - 0.5) * width * 1.2;
      const y = (Math.random() - 0.5) * height * 1.2;
      const z = Math.random() * 400 + 50;
      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        color: colors[type],
        size: type === 'orange' ? 3.5 : type === 'cyan' ? 3 : 2.2,
        type,
      });
    }

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      angle += 0.004;
      const cx = width / 2;
      const cy = height / 2;
      const fov = 350;

      const projected: Array<{ x: number; y: number; scale: number; p: (typeof particles)[0] }> = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        const rotX = p.baseX * cosA - (p.baseZ - 200) * sinA;
        const rotZ = p.baseX * sinA + (p.baseZ - 200) * cosA + 200;

        if (rotZ > 10) {
          const scale = fov / rotZ;
          const projX = cx + rotX * scale;
          const projY = cy + p.baseY * scale;
          projected.push({ x: projX, y: projY, scale, p });
        }
      }

      if (meshOn) {
        ctx.lineWidth = 0.6;
        for (let i = 0; i < projected.length; i++) {
          for (let j = i + 1; j < projected.length; j++) {
            const dx = projected[i].x - projected[j].x;
            const dy = projected[i].y - projected[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 85) {
              const alpha = (1 - dist / 85) * 0.35;
              ctx.strokeStyle = `rgba(56, 229, 173, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(projected[i].x, projected[i].y);
              ctx.lineTo(projected[j].x, projected[j].y);
              ctx.stroke();
            }
          }
        }
      }

      for (const pt of projected) {
        ctx.fillStyle = pt.p.color;
        ctx.shadowColor = pt.p.color;
        ctx.shadowBlur = pt.p.type === 'orange' ? 8 : 4;
        ctx.beginPath();
        if (pt.p.type === 'orange') {
          const s = pt.p.size * pt.scale * 0.9;
          ctx.moveTo(pt.x, pt.y - s);
          ctx.lineTo(pt.x + s, pt.y);
          ctx.lineTo(pt.x, pt.y + s);
          ctx.lineTo(pt.x - s, pt.y);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.arc(pt.x, pt.y, Math.max(1, pt.p.size * pt.scale * 0.7), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [meshOn]);

  const handleAddPOI = () => {
    const newPOI = {
      x: Math.floor(Math.random() * 40 + 30),
      y: Math.floor(Math.random() * 30 + 35),
      id: poiPins.length + 1,
      label: `POI_0${poiPins.length + 1}: TARGET_${String.fromCharCode(65 + poiPins.length)}`,
    };
    setPoiPins([...poiPins, newPOI]);
    setSpatialNodes((prev) => prev + 25);
  };

  const handleFinish = () => {
    setIsRecording(false);
    setIsDoneProcessing(true);
    stopCamera();
    setTimeout(() => {
      onFinishScan?.({
        name: 'ROOM_014 // RECONSTRUCTED',
        nodes: spatialNodes,
        keyframes: keyframes,
        quality: '99.2%',
      });
      onBack?.();
    }, 2000);
  };

  const handleStartRecording = async () => {
    if (isRecording) return;
    if (cameraActive && streamRef.current) {
      if (startVideoRecording(streamRef.current)) setIsRecording(true);
      return;
    }

    if (!isRequestingCamera) {
      const stream = await startCamera('environment');
      if (stream && startVideoRecording(stream)) setIsRecording(true);
    }
  };

  return (
    <div className="digital-twin-scan-app">
      {/* Real Camera Stream Video Layer (Plays Behind Spatial Overlays) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`ar-camera-video-feed ${cameraActive ? 'active' : ''} ${cameraFacing === 'user' ? 'mirror-feed' : ''}`}
      />

      {/* 3D AR Spatial Canvas Viewport */}
      <div className={`scan-viewport-layer ${cameraActive ? 'camera-live-active' : ''}`}>
        <canvas ref={canvasRef} className="ar-pointcloud-canvas" />

        {/* Central HUD Alignment Reticle */}
        <div className="center-reticle-wrap">
          <span className="reticle-top-dot" />
          <div className="reticle-cross-brackets">
            <span className="bracket tl" />
            <span className="bracket tr" />
            <span className="bracket bl" />
            <span className="bracket br" />
            <span className="center-target-ring" />
          </div>
          <div className="reticle-horizontal-guide left" />
          <div className="reticle-horizontal-guide right" />
        </div>

        {/* Floating Spatial AR Bounding Label 1: WALL_NORTH */}
        <div className="ar-tag tag-wall-north">
          <div className="tag-header">
            <span className="tag-label">[WALL_NORTH]</span>
            <span className="tag-dist">1.2m</span>
          </div>
          <div className="tag-gauge-line" />
        </div>

        {/* Floating Spatial AR Bounding Label 2: PLANE_FLOOR_01 */}
        <div className="ar-tag tag-plane-floor">
          <span className="plane-dot" />
          <span className="plane-name">[PLANE_FLOOR_01]</span>
          <span className="plane-confidence">98.4% CONFIDENCE</span>
        </div>

        {/* Custom Placed POI Pins */}
        {poiPins.map((poi) => (
          <div
            key={poi.id}
            className="ar-poi-marker"
            style={{ left: `${poi.x}%`, top: `${poi.y}%` }}
          >
            <span className="poi-icon">📍</span>
            <span className="poi-title">{poi.label}</span>
          </div>
        ))}

        {/* Vertical Height / Elevation Ruler on the right */}
        <div className="elevation-ruler-bar">
          <div className="ruler-notch"><span>+5.0m</span></div>
          <div className="ruler-notch"><span>+4.0m</span></div>
          <div className="ruler-notch highlight-green"><span>+3.0m</span></div>
          <div className="ruler-notch"><span>+2.0m</span></div>
          <div className="ruler-notch highlight-orange"><span>1.2m</span></div>
          <div className="ruler-notch"><span>0.5m</span></div>
          <div className="ruler-notch"><span>0.0m</span></div>
        </div>

        {/* Permission Request / Manual Camera Activate Button Overlay */}
        {!cameraActive && (
          <div className="camera-prompt-overlay">
            <button
              className="btn-activate-camera-prompt"
              onClick={() => startCamera('environment')}
              disabled={isRequestingCamera}
            >
              <span className="cam-prompt-icon">📷</span>
              <div className="cam-prompt-text">
                <strong>{isRequestingCamera ? 'REQUESTING CAMERA PERMISSION...' : 'ACTIVATE CAMERA SCAN'}</strong>
                <small>Tap to grant camera access for real-time 3D spatial mapping</small>
              </div>
            </button>
            {cameraError && (
              <div className="camera-error-banner">
                <span>⚠️ {cameraError}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main HUD Overlays Layer */}
      <div className="scan-hud-layer">
        {/* Top Header Row */}
        <header className="scan-topbar">
          <button className="btn-back-round" onClick={onBack} aria-label="Exit Session" title="Return to Workspace">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div className="session-title-block">
            <span className="session-type-tag">PHOTOGRAMMETRY SESSION</span>
            <h1 className="session-main-name">ROOM_014 // SCAN</h1>
          </div>

          <div className="topbar-action-tools">
            <button
              className={`tool-btn ${cameraActive ? 'active-camera' : ''}`}
              onClick={cameraActive ? toggleCameraFacing : () => startCamera('environment')}
              aria-label="Switch Camera / Toggle Feed"
              title={cameraActive ? `Switch to ${cameraFacing === 'environment' ? 'Front' : 'Back'} Camera` : 'Enable Camera'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <path d="M9 13a3 3 0 1 0 6 0 3 3 0 0 0-6 0" />
              </svg>
            </button>
            <button 
              className={`tool-btn ${torchOn ? 'active-torch' : ''}`}
              onClick={toggleTorch}
              aria-label="Flash / Torch"
              title="Toggle Torch / Flashlight"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </button>
          </div>
        </header>

        {/* Status Telemetry Badges Row */}
        <div className="scan-telemetry-row">
          <div className="pill-rec">
            <span className="rec-red-dot" />
            <span className="rec-label">REC</span>
            <span className="rec-timer">{formatTime(seconds)}</span>
          </div>

          <div className="pill-status">
            <span className="fps-dot" />
            <span>60 FPS</span>
          </div>

          <div className={`pill-status ${cameraActive ? 'pill-camera-streaming' : 'pill-lidar'}`}>
            <span className="lidar-icon">{cameraActive ? '📷' : '◎'}</span>
            <span>
              {cameraActive ? `${cameraFacing === 'environment' ? 'REAR' : 'FRONT'} CAMERA: ` : 'LiDAR: '}
              <b>{cameraActive ? 'STREAMING' : 'ACTIVE'}</b>
            </span>
          </div>

          <div className="pill-status pill-imu">
            <span className="lock-icon">🔒</span>
            <span>IMU: LOCKED</span>
          </div>
        </div>

        {/* Device Detection Banner & Guidance Stack */}
        <div className="guidance-banners-stack">
          {/* Device Type Notice */}
          <div className={`device-detector-pill ${isMobileDevice ? 'mobile-mode' : 'desktop-mode'}`}>
            <span className="detector-icon">{isMobileDevice ? '📱' : '💻'}</span>
            <span className="detector-text">
              {isMobileDevice
                ? cameraActive 
                  ? 'MOBILE DETECTED // HARDWARE CAMERA STREAMING' 
                  : 'MOBILE DETECTED // CAMERA READY'
                : cameraActive
                  ? 'DESKTOP DETECTED // WEBCAM STREAMING'
                  : 'DESKTOP DETECTED // CAMERA READY'}
            </span>
            {!cameraActive && (
              <button 
                className="btn-enable-cam"
                onClick={() => startCamera('environment')}
                title="Start live video stream"
              >
                START CAMERA
              </button>
            )}
          </div>

          <div className="guidance-banner banner-locked">
            <span className="banner-icon">✓</span>
            <span className="banner-text">Floor plane locked &amp; calibrated</span>
          </div>
          <div className="guidance-banner banner-move">
            <span className="banner-icon spin">🔄</span>
            <span className="banner-text">Move steadily across room perimeter</span>
          </div>
        </div>

        {/* Bottom Section: Progress & Action Controls */}
        <div className="scan-bottom-controls-wrap">
          {/* Spatial Coverage Progress */}
          <div className="coverage-section">
            <div className="coverage-header">
              <span className="coverage-label">SPATIAL COVERAGE</span>
              <span className="coverage-percentage">{spatialCoverage}%</span>
            </div>
            <div className="coverage-bar-track">
              <div className="coverage-bar-fill" style={{ width: `${spatialCoverage}%` }} />
            </div>
          </div>

          {/* Telemetry Metric Cards */}
          <div className="telemetry-metrics-grid">
            <div className="telemetry-box">
              <span className="t-label">KEYFRAMES</span>
              <strong className="t-value text-white">{keyframes}</strong>
            </div>
            <div className="telemetry-box">
              <span className="t-label">SPATIAL NODES</span>
              <strong className="t-value text-orange">{spatialNodes.toLocaleString()}</strong>
            </div>
            <div className="telemetry-box">
              <span className="t-label">MEMORY VOL</span>
              <strong className="t-value text-blue">{memoryVol} MB</strong>
            </div>
          </div>

          {/* Tool Action Toggles */}
          <div className="tool-toggles-row">
            <button
              className={`toggle-tool-btn ${torchOn ? 'active' : ''}`}
              onClick={toggleTorch}
            >
              <span className="btn-glyph">🔦</span>
              <span>TORCH: {torchOn ? 'ON' : 'OFF'}</span>
            </button>

            <button className="toggle-tool-btn" onClick={handleAddPOI}>
              <span className="btn-glyph text-orange">📍</span>
              <span>ADD POI PIN</span>
            </button>

            <button
              className={`toggle-tool-btn ${meshOn ? 'active' : ''}`}
              onClick={() => setMeshOn(!meshOn)}
            >
              <span className="btn-glyph text-blue">🕸</span>
              <span>MESH: {meshOn ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Capture Action Controls Bar */}
          <div className="capture-actions-bar">
            <button
              className="btn-pause-round"
              onClick={() => setIsRecording(!isRecording)}
              aria-label={isRecording ? 'Pause Capture' : 'Resume Capture'}
              title={isRecording ? 'Pause' : 'Resume'}
            >
              {isRecording ? '⏸' : '▶'}
            </button>

            <button
              className="btn-shutter-outer"
              onClick={handleStartRecording}
              aria-label={isRecording ? 'Recording in progress' : 'Start Recording'}
              title={isRecording ? 'Recording in progress' : 'Start Recording'}
            >
              <div className={`shutter-inner-square ${isRecording ? 'recording-active' : ''}`} />
            </button>

            <button
              className="btn-done-pill"
              onClick={handleFinish}
              title="Complete Digital Twin Reconstruction"
            >
              <span>DONE</span>
              <span className="check-icon">✓</span>
            </button>
          </div>
        </div>
      </div>

      {/* Processing NeRF / LiDAR Reconstruction Overlay */}
      {isDoneProcessing && (
        <div className="scan-processing-overlay">
          <div className="processing-dialog">
            <div className="processing-spinner" />
            <h2>GENERATING DIGITAL TWIN</h2>
            <p>Synthesizing 4K NeRF volumetric mesh &amp; point cloud...</p>
            <div className="processing-progress-bar">
              <div className="processing-progress-fill" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

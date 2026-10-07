import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Grid, OrbitControls, Splat, useGLTF } from '@react-three/drei';

function MeshScene({ meshUrl }: { meshUrl: string }) {
  const { scene } = useGLTF(meshUrl);
  return <primitive object={scene} />;
}

export default function ThreeDViewer({ modelUrl, meshUrl }: { modelUrl?: string; meshUrl?: string }) {
  const [viewMode, setViewMode] = useState<'splat' | 'mesh'>('splat');
  const showingMesh = viewMode === 'mesh' && Boolean(meshUrl);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#070a0e', position: 'relative' }}>
      {modelUrl ? (
        <Canvas camera={{ position: [8, 6, 8], fov: 45 }} shadows>
          <color attach="background" args={['#070a0e']} />
          <Suspense fallback={null}>
            {showingMesh && meshUrl ? <MeshScene meshUrl={meshUrl} /> : <Splat src={modelUrl} />}
            {showingMesh && <Environment preset="city" />}
          </Suspense>
          <Grid infiniteGrid fadeDistance={50} cellColor="#ffffff" sectionColor="#38e5ad" position={[0, -0.1, 0]} />
          <OrbitControls enablePan enableZoom enableRotate makeDefault />
        </Canvas>
      ) : (
        <div style={{ height: '100%', display: 'grid', placeItems: 'center' }}>
          <div style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: 12, textAlign: 'center' }}>
            NO RECONSTRUCTED ASSET AVAILABLE
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute', top: 20, left: 20, color: '#38e5ad',
        fontFamily: 'monospace', fontSize: 11, pointerEvents: 'none',
        zIndex: 2, background: 'rgba(0,0,0,0.5)', padding: 10,
        borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)'
      }}>
          <div style={{ fontWeight: 700, letterSpacing: 1 }}>● {showingMesh ? 'TSDF MESH SCENE' : 'GAUSSIAN SPLAT SCENE'}</div>
        <div style={{ marginTop: 4, color: '#fff' }}>
          RENDER: {modelUrl ? (showingMesh ? 'GEOMETRY / GLB DIGITAL TWIN' : 'REALISTIC SPLAT DIGITAL TWIN') : 'WAITING FOR SPLAT EXPORT'}
        </div>
      </div>

      {modelUrl && (
        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 6 }}>
          <button type="button" onClick={() => setViewMode('splat')} style={{ padding: '6px 8px', background: showingMesh ? '#111820' : '#0e8f6a', color: '#fff', border: '1px solid #38e5ad' }}>
            SPLAT
          </button>
          <button type="button" disabled={!meshUrl} onClick={() => setViewMode('mesh')} style={{ padding: '6px 8px', background: showingMesh ? '#0e8f6a' : '#111820', color: '#fff', border: '1px solid #38e5ad', opacity: meshUrl ? 1 : 0.45 }}>
            MESH
          </button>
        </div>
      )}
    </div>
  );
}

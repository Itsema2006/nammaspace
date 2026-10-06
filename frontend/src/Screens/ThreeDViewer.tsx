import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Grid, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function ReconstructedScene({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}

export default function ThreeDViewer({ modelUrl }: { modelUrl?: string }) {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#070a0e', position: 'relative' }}>
      {modelUrl ? (
        <Canvas camera={{ position: [8, 6, 8], fov: 45 }} shadows>
          <color attach="background" args={['#070a0e']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[8, 12, 6]} intensity={1.4} castShadow />
          <Suspense fallback={null}>
            <ReconstructedScene modelUrl={modelUrl} />
            <Environment preset="city" />
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
        <div style={{ fontWeight: 700, letterSpacing: 1 }}>● RECONSTRUCTED SCENE</div>
        <div style={{ marginTop: 4, color: '#fff' }}>
          RENDER: {modelUrl ? 'GLB / GLTF DIGITAL TWIN' : 'WAITING FOR MESH EXPORT'}
        </div>
      </div>
    </div>
  );
}

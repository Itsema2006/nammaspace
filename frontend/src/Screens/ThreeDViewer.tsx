import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// A procedural, interactive "Digital Twin" point cloud 
function SpatialPointCloud() {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate a procedural environment that looks like a scanned room / logistics hub
  const [positions, colors] = useMemo(() => {
    const points = [];
    const colors = [];
    const colorTheme = new THREE.Color('#38e5ad'); // Signature NammaSpace Green
    const colorSecondary = new THREE.Color('#38bdf8'); // Cyan highlight

    // Floor plane points
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      points.push(x, 0, z);
      colors.push(colorTheme.r, colorTheme.g, colorTheme.b);
    }

    // Walls and structures
    for (let i = 0; i < 4000; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = Math.random() * 10;
      const z = (Math.random() - 0.5) * 30;
      
      // Keep only points that form structural walls or pillars
      if (Math.abs(x) > 14 || Math.abs(z) > 14 || (Math.abs(x) < 2 && Math.abs(z) < 2)) {
        points.push(x, y, z);
        
        // Add color variations
        if (y > 8) {
          colors.push(colorSecondary.r, colorSecondary.g, colorSecondary.b);
        } else {
          colors.push(colorTheme.r, colorTheme.g, colorTheme.b);
        }
      }
    }

    // Random noise (sensor artifacts)
    for (let i = 0; i < 500; i++) {
      points.push((Math.random() - 0.5) * 40, Math.random() * 15, (Math.random() - 0.5) * 40);
      colors.push(0.5, 0.5, 0.5);
    }

    return [new Float32Array(points), new Float32Array(colors)];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled>
      <PointMaterial
        transparent
        vertexColors
        size={0.12}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

function WireframeBuilding() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 4, 0]}>
      <boxGeometry args={[18, 8, 18]} />
      <meshBasicMaterial color="#1e4d3b" wireframe={true} transparent opacity={0.3} />
    </mesh>
  );
}

export default function ThreeDViewer() {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#070a0e', position: 'relative' }}>
      <Canvas camera={{ position: [25, 20, 25], fov: 45 }}>
        <color attach="background" args={['#070a0e']} />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        
        <SpatialPointCloud />
        <WireframeBuilding />
        
        <Grid 
          infiniteGrid 
          fadeDistance={50} 
          cellColor="#1e3a8a" 
          sectionColor="#2563eb" 
          position={[0, -0.1, 0]} 
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          maxDistance={60}
          minDistance={5}
        />
        <Environment preset="city" />
      </Canvas>
      
      {/* Live Overlay UI for 3D View */}
      <div style={{ 
        position: 'absolute', top: 20, left: 20, color: '#38e5ad', 
        fontFamily: '"IBM Plex Mono", monospace', fontSize: '11px', pointerEvents: 'none' 
      }}>
        <div style={{ fontWeight: 700, letterSpacing: '1px' }}>● 3D ENGINE ACTIVE</div>
        <div style={{ color: '#94a3b8', marginTop: 4 }}>RENDER: Point Cloud + Wireframe Mesh</div>
        <div style={{ color: '#94a3b8' }}>FOV: 45° | FPS: 60</div>
      </div>
    </div>
  );
}

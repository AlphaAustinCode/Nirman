"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedSphere() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(clock.getElapsedTime()) * 0.2;
      sphereRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Sphere args={[1, 64, 64]} ref={sphereRef} scale={1.5} position={[2, 0, -2]}>
      <MeshDistortMaterial
        color="#FFB380"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        emissive="#FF6B35"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
}

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 100;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.05) * 0.5;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#FFC857" transparent opacity={0.6} />
    </points>
  );
}

export default function ThreeDBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#FF6B35" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4A90E2" />
        <AnimatedSphere />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}

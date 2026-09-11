"use client";

import { Line, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { MutableRefObject, useMemo, useRef } from "react";
import * as THREE from "three";

type SolarSceneProps = {
  progress: MutableRefObject<number>;
  pointer: MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
};

const orbitPoints = (radiusX: number, radiusY: number, offsetX = -4.8) =>
  Array.from({ length: 96 }, (_, index) => {
    const angle = (index / 95) * Math.PI * 2;
    return new THREE.Vector3(
      offsetX + Math.cos(angle) * radiusX,
      -1.8 + Math.sin(angle) * radiusY,
      -1.4
    );
  });

function Sun({ reducedMotion }: { reducedMotion: boolean }) {
  const corona = useRef<THREE.Mesh>(null);
  const surface = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!surface.current || !corona.current) return;
    if (!reducedMotion) {
      surface.current.rotation.y += delta * 0.04;
      const pulse = 1 + Math.sin(clock.elapsedTime * 0.85) * 0.018;
      corona.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[-5.25, -2.45, -0.9]}>
      <pointLight color="#f29a3a" intensity={120} distance={32} decay={1.5} />
      <mesh ref={surface}>
        <sphereGeometry args={[2.7, 96, 96]} />
        <meshStandardMaterial
          color="#f28d28"
          emissive="#e56f16"
          emissiveIntensity={2.8}
          roughness={0.78}
        />
      </mesh>
      <mesh ref={corona} scale={1.08}>
        <sphereGeometry args={[2.7, 64, 64]} />
        <meshBasicMaterial
          color="#ff9d3d"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.2}>
        <sphereGeometry args={[2.7, 48, 48]} />
        <meshBasicMaterial
          color="#ff7b1f"
          transparent
          opacity={0.035}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

type PlanetProps = {
  position: [number, number, number];
  radius: number;
  color: string;
  accent: string;
  ring?: boolean;
  speed: number;
  reducedMotion: boolean;
};

function Planet({ position, radius, color, accent, ring, speed, reducedMotion }: PlanetProps) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    if (!mesh.current || !group.current || reducedMotion) return;
    mesh.current.rotation.y += delta * speed;
    group.current.position.y = position[1] + Math.sin(clock.elapsedTime * speed) * 0.035;
  });

  return (
    <group ref={group} position={position}>
      <mesh ref={mesh} castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color={color} roughness={0.92} metalness={0.03} />
      </mesh>
      <mesh scale={1.012}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {ring ? (
        <mesh rotation={[Math.PI / 2.35, 0.2, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 2.05, 96]} />
          <meshBasicMaterial color="#c9aa79" transparent opacity={0.34} side={THREE.DoubleSide} />
        </mesh>
      ) : null}
    </group>
  );
}

function Scene({ progress, pointer, reducedMotion }: SolarSceneProps) {
  const world = useRef<THREE.Group>(null);
  const orbitSets = useMemo(
    () => [
      orbitPoints(5.1, 1.25),
      orbitPoints(7.9, 2.05),
      orbitPoints(10.5, 2.85),
      orbitPoints(13.4, 3.6),
    ],
    []
  );

  useFrame((state) => {
    const p = progress.current;
    const mouse = pointer.current;
    const targetX = p * 8.4;
    const targetY = Math.sin(p * Math.PI) * 0.45;
    const targetZ = 10.5 - Math.sin(p * Math.PI) * 0.65;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.035);
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      targetY + (reducedMotion ? 0 : mouse.y * 0.12),
      0.035
    );
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.035);
    state.camera.lookAt(targetX * 0.82, -0.2, -1.5);

    if (world.current && !reducedMotion) {
      world.current.rotation.y = THREE.MathUtils.lerp(world.current.rotation.y, mouse.x * 0.018, 0.04);
      world.current.rotation.x = THREE.MathUtils.lerp(world.current.rotation.x, -mouse.y * 0.012, 0.04);
    }
  });

  return (
    <>
      <color attach="background" args={["#030405"]} />
      <fog attach="fog" args={["#030405", 13, 34]} />
      <ambientLight intensity={0.17} color="#8aa5c2" />
      <directionalLight position={[7, 6, 8]} intensity={1.8} color="#b4cfdf" />
      <Stars radius={70} depth={36} count={2200} factor={2.2} saturation={0.12} fade speed={0.22} />

      <group ref={world}>
        {orbitSets.map((points, index) => (
          <Line
            key={index}
            points={points}
            color={index === 0 ? "#b88249" : "#77746e"}
            transparent
            opacity={index === 0 ? 0.35 : 0.18}
            lineWidth={0.48}
          />
        ))}
        <Sun reducedMotion={reducedMotion} />
        <Planet
          position={[0.1, -1.05, -1.15]}
          radius={0.26}
          color="#9a7e63"
          accent="#e1b27b"
          speed={0.18}
          reducedMotion={reducedMotion}
        />
        <Planet
          position={[3.15, 0.25, -1.75]}
          radius={0.48}
          color="#6e2d21"
          accent="#b9653d"
          speed={0.13}
          reducedMotion={reducedMotion}
        />
        <Planet
          position={[6.1, 0.9, -2.2]}
          radius={0.82}
          color="#315d71"
          accent="#7db5cc"
          speed={0.1}
          reducedMotion={reducedMotion}
        />
        <Planet
          position={[9.1, -0.25, -2.55]}
          radius={1.02}
          color="#8a755d"
          accent="#d0ad72"
          ring
          speed={0.075}
          reducedMotion={reducedMotion}
        />
      </group>
    </>
  );
}

export function SolarScene(props: SolarSceneProps) {
  return (
    <div className="space-canvas" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10.5], fov: 46 }} gl={{ antialias: true }}>
        <Scene {...props} />
      </Canvas>
    </div>
  );
}

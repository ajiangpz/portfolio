"use client";

import { Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type SceneName = "solar" | "mars" | "saturn" | "void";

type SceneProps = {
  activeScene: SceneName;
  reducedMotion: boolean;
  onReady: () => void;
  onFailure: () => void;
};

const sunVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sunFragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(.1, .2, .3));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec3(7.1, 3.7, 5.4);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 p = normalize(vPosition) * 5.2;
    float flow = fbm(p + vec3(0.0, uTime * 0.07, uTime * 0.025));
    float cells = fbm(p * 2.1 - vec3(uTime * 0.025, 0.0, uTime * 0.04));
    float filament = smoothstep(0.34, 0.82, flow * 0.74 + cells * 0.46);
    float limb = pow(max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0), 0.32);
    vec3 deep = vec3(0.62, 0.075, 0.006);
    vec3 orange = vec3(1.0, 0.31, 0.025);
    vec3 hot = vec3(1.0, 0.83, 0.34);
    vec3 color = mix(deep, orange, flow);
    color = mix(color, hot, filament * 0.72);
    color *= 0.68 + limb * 0.68;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const saturnVertexShader = sunVertexShader;
const saturnFragmentShader = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  void main() {
    float y = vUv.y;
    float bands = sin(y * 116.0 + sin(y * 27.0) * 2.2) * 0.5 + 0.5;
    float fine = sin(y * 410.0) * 0.5 + 0.5;
    float storm = smoothstep(0.55, 0.95, sin(vUv.x * 20.0 + y * 44.0 + uTime * 0.02) * 0.5 + 0.5);
    vec3 cream = vec3(0.72, 0.60, 0.43);
    vec3 sand = vec3(0.45, 0.32, 0.22);
    vec3 pale = vec3(0.88, 0.78, 0.61);
    vec3 color = mix(sand, cream, bands);
    color = mix(color, pale, fine * 0.18 + storm * 0.06);
    float light = 0.23 + max(dot(normalize(vNormal), normalize(vec3(-0.55, 0.25, 1.0))), 0.0) * 0.98;
    gl_FragColor = vec4(color * light, 1.0);
  }
`;

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function makeEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return new THREE.CanvasTexture(canvas);
  const ocean = context.createLinearGradient(0, 0, 0, canvas.height);
  ocean.addColorStop(0, "#07131d");
  ocean.addColorStop(0.5, "#123954");
  ocean.addColorStop(1, "#06111a");
  context.fillStyle = ocean;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const continents = [
    [[.08,.2],[.18,.13],[.27,.2],[.24,.31],[.18,.36],[.16,.49],[.1,.43],[.05,.31]],
    [[.2,.46],[.29,.48],[.32,.59],[.28,.76],[.23,.9],[.18,.7]],
    [[.49,.2],[.59,.15],[.69,.22],[.75,.35],[.69,.43],[.62,.4],[.58,.52],[.48,.47],[.43,.34]],
    [[.54,.48],[.63,.48],[.66,.61],[.61,.81],[.54,.75],[.5,.59]],
    [[.76,.59],[.85,.57],[.9,.68],[.86,.78],[.76,.75],[.72,.66]],
  ];
  for (const polygon of continents) {
    context.beginPath();
    polygon.forEach(([x, y], index) => index === 0 ? context.moveTo(x * canvas.width, y * canvas.height) : context.lineTo(x * canvas.width, y * canvas.height));
    context.closePath();
    const land = context.createLinearGradient(0, canvas.height * .1, 0, canvas.height * .9);
    land.addColorStop(0, "#738166");
    land.addColorStop(.45, "#38533e");
    land.addColorStop(.7, "#735f3a");
    land.addColorStop(1, "#63705c");
    context.fillStyle = land;
    context.fill();
  }

  const random = seededRandom(42);
  context.globalCompositeOperation = "overlay";
  for (let i = 0; i < 9000; i++) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const radius = random() * 2.2 + .25;
    context.fillStyle = random() > .47 ? `rgba(255,255,255,${random() * .075})` : `rgba(0,0,0,${random() * .1})`;
    context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill();
  }
  context.globalCompositeOperation = "source-over";
  const polar = context.createLinearGradient(0, 0, 0, canvas.height);
  polar.addColorStop(0, "rgba(225,239,238,.92)"); polar.addColorStop(.07, "rgba(225,239,238,0)");
  polar.addColorStop(.93, "rgba(225,239,238,0)"); polar.addColorStop(1, "rgba(225,239,238,.92)");
  context.fillStyle = polar; context.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeCloudTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048; canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const random = seededRandom(87);
  context.filter = "blur(9px)";
  for (let i = 0; i < 520; i++) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const width = 16 + random() * 95;
    const height = 2 + random() * 10;
    context.fillStyle = `rgba(255,255,255,${.018 + random() * .08})`;
    context.beginPath(); context.ellipse(x, y, width, height, random() * .4 - .2, 0, Math.PI * 2); context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function makeMarsTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048; canvas.height = 1024;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) return new THREE.CanvasTexture(canvas);
  const base = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  base.addColorStop(0, "#35150d"); base.addColorStop(.45, "#9a4325"); base.addColorStop(1, "#4b1d12");
  context.fillStyle = base; context.fillRect(0, 0, canvas.width, canvas.height);
  const random = seededRandom(314);
  for (let i = 0; i < 4800; i++) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const radius = random() > .93 ? 6 + random() * 28 : .4 + random() * 4.2;
    const gradient = context.createRadialGradient(x - radius * .25, y - radius * .25, .1, x, y, radius);
    gradient.addColorStop(0, `rgba(240,154,92,${random() * .17})`);
    gradient.addColorStop(.62, `rgba(91,31,17,${.04 + random() * .2})`);
    gradient.addColorStop(1, "rgba(24,7,4,0)");
    context.fillStyle = gradient; context.beginPath(); context.arc(x, y, radius, 0, Math.PI * 2); context.fill();
  }
  context.strokeStyle = "rgba(255,177,116,.12)"; context.lineWidth = 8;
  context.beginPath(); context.moveTo(160, 490); context.bezierCurveTo(610, 390, 1050, 620, 1880, 430); context.stroke();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 8;
  return texture;
}

function makeRingTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048; canvas.height = 32;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
  const stops: Array<[number, string]> = [[0,"rgba(95,75,55,0)"],[.06,"rgba(184,157,119,.45)"],[.19,"rgba(227,204,162,.82)"],[.28,"rgba(80,64,49,.17)"],[.36,"rgba(234,211,171,.7)"],[.53,"rgba(181,149,108,.5)"],[.62,"rgba(31,26,22,.07)"],[.72,"rgba(217,191,149,.7)"],[.9,"rgba(126,100,72,.35)"],[1,"rgba(70,52,38,0)"]];
  stops.forEach(([at, color]) => gradient.addColorStop(at, color));
  context.fillStyle = gradient; context.fillRect(0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  return texture;
}

function StarField({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const random = seededRandom(2026);
    const values = new Float32Array(5200 * 3);
    for (let i = 0; i < 5200; i++) {
      const radius = 18 + random() * 38;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      values[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      values[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      values[i * 3 + 2] = radius * Math.cos(phi);
    }
    return values;
  }, []);
  useFrame((_, delta) => { if (ref.current && !reducedMotion) ref.current.rotation.y += delta * .003; });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial size={.035} color="#dfe9ee" transparent opacity={.74} sizeAttenuation depthWrite={false} /></points>;
}

function Sun({ reducedMotion }: { reducedMotion: boolean }) {
  const surface = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (surface.current && !reducedMotion) surface.current.uniforms.uTime.value += delta;
    if (mesh.current && !reducedMotion) mesh.current.rotation.y += delta * .018;
  });
  return <group position={[-4.6, -.75, 0]}>
    <mesh ref={mesh}><sphereGeometry args={[3.7, 160, 160]} /><shaderMaterial ref={surface} vertexShader={sunVertexShader} fragmentShader={sunFragmentShader} uniforms={{ uTime: { value: 0 } }} /></mesh>
    <mesh scale={1.06}><sphereGeometry args={[3.7, 96, 96]} /><meshBasicMaterial color="#ff6b16" transparent opacity={.13} side={THREE.BackSide} blending={THREE.AdditiveBlending} /></mesh>
    <pointLight color="#ff9a42" intensity={46} distance={35} decay={1.65} />
  </group>;
}

function Earth({ reducedMotion }: { reducedMotion: boolean }) {
  const earth = useRef<THREE.Mesh>(null);
  const clouds = useRef<THREE.Mesh>(null);
  const map = useMemo(makeEarthTexture, []);
  const cloudMap = useMemo(makeCloudTexture, []);
  useEffect(() => () => { map.dispose(); cloudMap.dispose(); }, [map, cloudMap]);
  useFrame((_, delta) => {
    if (!reducedMotion && earth.current && clouds.current) { earth.current.rotation.y += delta * .045; clouds.current.rotation.y += delta * .061; }
  });
  return <group position={[4.35, .28, .6]} rotation={[0, 0, -.16]}>
    <mesh ref={earth}><sphereGeometry args={[.92, 128, 128]} /><meshStandardMaterial map={map} bumpMap={map} bumpScale={.025} roughness={.82} metalness={0} /></mesh>
    <mesh ref={clouds} scale={1.012}><sphereGeometry args={[.92, 96, 96]} /><meshStandardMaterial map={cloudMap} transparent opacity={.5} depthWrite={false} /></mesh>
    <mesh scale={1.055}><sphereGeometry args={[.92, 96, 96]} /><meshBasicMaterial color="#6dc7ff" transparent opacity={.11} side={THREE.BackSide} blending={THREE.AdditiveBlending} /></mesh>
  </group>;
}

function Mars({ reducedMotion }: { reducedMotion: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const map = useMemo(makeMarsTexture, []);
  useEffect(() => () => map.dispose(), [map]);
  useFrame((_, delta) => { if (mesh.current && !reducedMotion) mesh.current.rotation.y += delta * .026; });
  return <group position={[-3.35, -.05, 0]} rotation={[.04, 0, -.09]}>
    <mesh ref={mesh}><sphereGeometry args={[2.72, 160, 160]} /><meshStandardMaterial map={map} bumpMap={map} bumpScale={.07} roughness={1} /></mesh>
    <mesh scale={1.035}><sphereGeometry args={[2.72, 96, 96]} /><meshBasicMaterial color="#d5562e" transparent opacity={.08} side={THREE.BackSide} blending={THREE.AdditiveBlending} /></mesh>
  </group>;
}

function Saturn({ reducedMotion }: { reducedMotion: boolean }) {
  const planet = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const rings = useRef<THREE.Mesh>(null);
  const ringMap = useMemo(makeRingTexture, []);
  useEffect(() => () => ringMap.dispose(), [ringMap]);
  useFrame((_, delta) => {
    if (!reducedMotion) {
      if (planet.current) planet.current.rotation.y += delta * .024;
      if (rings.current) rings.current.rotation.z += delta * .003;
      if (material.current) material.current.uniforms.uTime.value += delta;
    }
  });
  return <group position={[3.1, .1, -.1]} rotation={[.16, 0, -.29]}>
    <mesh ref={planet}><sphereGeometry args={[2.28, 160, 160]} /><shaderMaterial ref={material} vertexShader={saturnVertexShader} fragmentShader={saturnFragmentShader} uniforms={{ uTime: { value: 0 } }} /></mesh>
    <mesh ref={rings} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[2.85, 5.1, 256]} /><meshBasicMaterial map={ringMap} transparent opacity={.88} side={THREE.DoubleSide} depthWrite={false} /></mesh>
  </group>;
}

function Scene({ activeScene, reducedMotion }: Pick<SceneProps, "activeScene" | "reducedMotion">) {
  const solar = useRef<THREE.Group>(null);
  const mars = useRef<THREE.Group>(null);
  const saturn = useRef<THREE.Group>(null);
  const { pointer, camera, viewport } = useThree();
  const orbitOne = useMemo(() => Array.from({ length: 100 }, (_, i) => { const a = i / 99 * Math.PI * 2; return [Math.cos(a) * 5.1, Math.sin(a) * 1.08, -.25] as [number, number, number]; }), []);
  const orbitTwo = useMemo(() => Array.from({ length: 100 }, (_, i) => { const a = i / 99 * Math.PI * 2; return [Math.cos(a) * 6.5, Math.sin(a) * 1.72, -.5] as [number, number, number]; }), []);

  useFrame((state, delta) => {
    const step = 1 - Math.exp(-delta * 3.5);
    const targets: Record<"solar" | "mars" | "saturn", number> = {
      solar: activeScene === "solar" ? 1 : .001,
      mars: activeScene === "mars" ? 1 : .001,
      saturn: activeScene === "saturn" ? 1 : .001,
    };
    ([[solar.current, targets.solar], [mars.current, targets.mars], [saturn.current, targets.saturn]] as Array<[THREE.Group | null, number]>).forEach(([group, target]) => {
      if (group) group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, target, step));
    });
    const parallax = reducedMotion ? 0 : .12;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * parallax, step);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * parallax, step);
    camera.lookAt(0, 0, 0);
    state.gl.toneMappingExposure = activeScene === "solar" ? 1.08 : .96;
    if (viewport.width < 7) {
      if (solar.current) solar.current.position.x = -1.6;
      if (mars.current) mars.current.position.x = -1.45;
      if (saturn.current) saturn.current.position.x = 1.65;
    } else {
      if (solar.current) solar.current.position.x = 0;
      if (mars.current) mars.current.position.x = 0;
      if (saturn.current) saturn.current.position.x = 0;
    }
  });

  return <>
    <fog attach="fog" args={["#030405", 12, 54]} />
    <ambientLight intensity={.09} />
    <directionalLight position={[-5, 4, 7]} color="#ffd0a2" intensity={2.1} />
    <StarField reducedMotion={reducedMotion} />
    <group ref={solar}>
      <Sun reducedMotion={reducedMotion} /><Earth reducedMotion={reducedMotion} />
      <Line points={orbitOne} color="#f1e5d0" transparent opacity={.17} lineWidth={.45} />
      <Line points={orbitTwo} color="#e69a45" transparent opacity={.17} lineWidth={.5} />
    </group>
    <group ref={mars} scale={.001}><Mars reducedMotion={reducedMotion} /></group>
    <group ref={saturn} scale={.001}><Saturn reducedMotion={reducedMotion} /></group>
  </>;
}

export function SolarSystemScene({ activeScene, reducedMotion, onReady, onFailure }: SceneProps) {
  return <Canvas
    className="three-canvas"
    camera={{ position: [0, 0, 10], fov: 42, near: .1, far: 100 }}
    dpr={[1, 1.75]}
    gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
    onCreated={({ gl }) => {
      gl.outputColorSpace = THREE.SRGBColorSpace;
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      onReady();
      gl.domElement.addEventListener("webglcontextlost", onFailure, { once: true });
    }}
    onPointerMissed={() => undefined}
  >
    <Scene activeScene={activeScene} reducedMotion={reducedMotion} />
  </Canvas>;
}

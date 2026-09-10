"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const projects = [
  { id: "OBJ–01", name: "RAIN SCOPE", type: "DATA VISUALIZATION", description: "A weather intelligence interface turning live atmospheric data into a spatial story.", stack: "MAPLIBRE / THREE.JS / TYPESCRIPT", year: "2025—PRESENT", color: "#c87b42" },
  { id: "OBJ–02", name: "NETWORK SYSTEMS", type: "PRODUCT ENGINEERING", description: "Interfaces for configuring, observing and understanding connected infrastructure.", stack: "VUE / NUXT / WEBGL", year: "2021—2025", color: "#8ba4ad" },
  { id: "OBJ–03", name: "AGENT LAB", type: "INTELLIGENT SYSTEMS", description: "Experiments in tool-using agents, observable execution and reliable human control.", stack: "NEXT.JS / NESTJS / AI SDK", year: "ACTIVE RESEARCH", color: "#d6b06b" },
] as const;

function Stars() {
  const points = useMemo(() => {
    const data = new Float32Array(900 * 3);
    let seed = 19;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < data.length; i += 3) {
      data[i] = (random() - 0.5) * 44;
      data[i + 1] = (random() - 0.5) * 24;
      data[i + 2] = -random() * 26;
    }
    return data;
  }, []);
  return <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[points, 3]} /></bufferGeometry><pointsMaterial color="#d8dde4" size={0.026} transparent opacity={0.75} sizeAttenuation /></points>;
}

function Orbit({ radius, opacity = 0.3 }: { radius: number; opacity?: number }) {
  const points = useMemo(() => Array.from({ length: 97 }, (_, i) => {
    const a = (i / 96) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius * 0.46);
  }), [radius]);
  return <Line points={points} color="#8b8984" lineWidth={0.55} transparent opacity={opacity} />;
}

function System({ progress }: { progress: number }) {
  const root = useRef<THREE.Group>(null);
  const planets = useRef<Array<THREE.Mesh | null>>([]);
  useFrame(({ camera, clock }) => {
    const eased = THREE.MathUtils.smoothstep(progress, 0, 1);
    camera.position.x = THREE.MathUtils.lerp(0.2, 7.8, eased);
    camera.position.y = THREE.MathUtils.lerp(0.3, 1.2, eased);
    camera.lookAt(THREE.MathUtils.lerp(0, 6.5, eased), 0, 0);
    if (root.current) root.current.rotation.y = progress * -0.18;
    planets.current.forEach((planet, index) => { if (planet) planet.rotation.y = clock.elapsedTime * (0.13 + index * 0.035); });
  });
  const positions: [number, number, number][] = [[2.7, 0, 1.45], [6.15, 0.1, -1.1], [9.1, -0.1, 1.35]];
  const sizes = [0.24, 0.4, 0.62];
  return (
    <group ref={root} rotation={[-0.24, 0, -0.08]}>
      <ambientLight intensity={0.14} />
      <pointLight position={[-5, 0, 0]} color="#ffb45f" intensity={45} distance={30} />
      <mesh position={[-5.3, -1.2, -1.8]}><sphereGeometry args={[3.5, 64, 64]} /><meshBasicMaterial color="#e27b25" /></mesh>
      <pointLight position={[-3.4, -0.5, -1]} color="#ff8a32" intensity={65} distance={12} />
      <Orbit radius={4.7} opacity={0.2} /><Orbit radius={7.1} opacity={0.33} /><Orbit radius={9.8} opacity={0.2} />
      {projects.map((project, index) => <mesh key={project.id} position={positions[index]} ref={(node) => { planets.current[index] = node; }}><sphereGeometry args={[sizes[index], 40, 40]} /><meshStandardMaterial color={project.color} roughness={0.72} metalness={0.06} /></mesh>)}
    </group>
  );
}

function SpaceCanvas({ progress }: { progress: number }) {
  return <div className="space-canvas" aria-hidden="true"><Canvas camera={{ position: [0.2, 0.3, 9.5], fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true }}><color attach="background" args={["#050608"]} /><Stars /><System progress={progress} /></Canvas></div>;
}

export default function SolarExperience() {
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => { const range = document.documentElement.scrollHeight - window.innerHeight; setProgress(range > 0 ? window.scrollY / range : 0); }); };
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return (
    <main>
      <SpaceCanvas progress={progress} />
      <header className="site-header">
        <a className="wordmark" href="#index" aria-label="John Digital Orbit, back to index">J/DO <span>SYS.2026</span></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="site-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? "CLOSE" : "MENU"}</button>
        <nav id="site-navigation" className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Primary navigation">
          {[["INDEX", "#index"], ["WORK", "#work"], ["ABOUT", "#about"], ["CONTACT", "#contact"]].map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <p className="coordinates">22.5431° N&nbsp; / &nbsp;114.0579° E</p>
      </header>
      <div className="journey" aria-hidden="true"><span>00</span><div><i style={{ transform: `scaleY(${Math.max(progress, 0.015)})` }} /></div><span>04</span></div>
      <section className="hero" id="index"><div className="hero-copy"><p className="eyebrow">PERSONAL OBSERVATORY / SHENZHEN</p><h1>JOHN <em>/</em><br />DIGITAL ORBIT</h1><p className="role">Frontend &amp; AI Agent Engineer</p><p className="intro">I build interfaces where data, motion and intelligent systems become visible.</p></div><p className="scroll-note"><span /> SCROLL TO NAVIGATE</p></section>
      <section className="work" id="work" aria-labelledby="work-title">
        <div className="section-heading"><p className="eyebrow">SELECTED OBJECTS / 03</p><h2 id="work-title">Work in<br />continuous orbit.</h2></div>
        {projects.map((project, index) => <article className={`project project-${index + 1}`} key={project.id}><div className="crosshair" aria-hidden="true">+</div><div className="project-meta"><span>{project.id}</span><span>{project.type}</span><span>{project.year}</span></div><h3>{project.name}</h3><p>{project.description}</p><div className="project-footer"><span>{project.stack}</span><a href="#contact" aria-label={`Request details about ${project.name}`}>EXPLORE OBJECT <b>↗</b></a></div></article>)}
      </section>
      <section className="about" id="about" aria-labelledby="about-title"><p className="eyebrow">FIELD NOTES / ABOUT</p><div className="about-grid"><h2 id="about-title">Engineering<br />with a point<br />of view.</h2><div className="about-copy"><p>My work sits between systems engineering and visual communication. I turn complex products into interfaces people can understand, trust and use.</p><dl><div><dt>FOCUS</dt><dd>Frontend systems<br />AI agent interfaces<br />Data visualization</dd></div><div><dt>APPROACH</dt><dd>Clear hierarchy<br />Observable behavior<br />Measured motion</dd></div></dl></div></div></section>
      <footer id="contact" className="contact"><p className="eyebrow">TRANSMISSION CHANNEL / OPEN</p><h2>Let’s build something<br />worth observing.</h2><div className="contact-row"><a href="https://github.com/ajiangpz" target="_blank" rel="noreferrer">GITHUB <span>↗</span></a><a href="mailto:hello@example.com">EMAIL <span>↗</span></a><p>© 2026 JOHN<br />SHENZHEN, CN</p></div></footer>
    </main>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { SolarScene } from "./solar-scene";

const copy = {
  en: {
    nav: ["INDEX", "WORK", "PROFILE", "CONTACT"],
    eyebrow: "SOLAR ARCHIVE / 2026",
    role: "Frontend Engineer & Creative Technologist",
    intro: "I build interfaces where data, motion, and complex systems become visible.",
    scroll: "SCROLL TO NAVIGATE",
    selected: "SELECTED OBJECTS",
    workLead: "Three active systems in one evolving orbit.",
    projects: [
      {
        code: "OBJ–01",
        title: "RainScope",
        type: "WEATHER VISUALIZATION",
        description:
          "A live reading of Shenzhen weather: rain bands, wind fields, warnings, and time rendered as one spatial system.",
        stack: "MAPLIBRE / ECHARTS / THREE.JS",
        status: "ACTIVE",
        href: "https://github.com/ajiangpz/sz-weather",
      },
      {
        code: "OBJ–02",
        title: "Network Systems",
        type: "PRODUCT INTERFACE",
        description:
          "Interfaces for configuring ports, VLANs, PoE schedules, diagnostics, and real-time device state without hiding operational complexity.",
        stack: "VUE / TYPESCRIPT / DATA VIS",
        status: "FIELD WORK",
        href: "#profile",
      },
      {
        code: "OBJ–03",
        title: "Agent Lab",
        type: "AI SYSTEMS",
        description:
          "A tool-using agent runtime with validated calls, resilient execution, observable steps, memory, and explicit failure boundaries.",
        stack: "NEXT.JS / NESTJS / POSTGRESQL",
        status: "IN DEVELOPMENT",
        href: "#contact",
      },
    ],
    profileLabel: "FLIGHT PROFILE",
    profileTitle: "Engineering clarity into complex products.",
    profileBody:
      "Seven years across data platforms, product interfaces, and technical communication. I work between frontend architecture and visual systems—turning dense device logic and live data into interfaces people can trust.",
    capabilities: [
      ["01", "INTERFACE SYSTEMS", "Production UI architecture, design systems, responsive delivery"],
      ["02", "DATA & SPACE", "Geospatial visualization, realtime data, WebGL and Three.js"],
      ["03", "AGENT ENGINEERING", "Tool execution, orchestration, memory, validation and observability"],
    ],
    contactLabel: "TRANSMISSION / OPEN",
    contactTitle: "Let’s make a difficult system feel inevitable.",
    contactBody: "Available for senior frontend and creative technology opportunities in Shenzhen.",
    email: "EMAIL ADDRESS / TO BE ADDED",
    github: "GITHUB / AJIANGPZ",
  },
  zh: {
    nav: ["首页", "项目", "档案", "联系"],
    eyebrow: "太阳系档案 / 2026",
    role: "前端工程师 / 创意技术开发者",
    intro: "让数据、动态与复杂系统，成为清晰可见的界面。",
    scroll: "滚动进入轨道",
    selected: "精选天体",
    workLead: "三个持续演进的系统，共处同一条技术轨道。",
    projects: [
      {
        code: "OBJ–01",
        title: "RainScope",
        type: "天气可视化",
        description: "将深圳雨带、风场、预警与时间轴组织为一套连续、可探索的空间天气系统。",
        stack: "MAPLIBRE / ECHARTS / THREE.JS",
        status: "持续迭代",
        href: "https://github.com/ajiangpz/sz-weather",
      },
      {
        code: "OBJ–02",
        title: "Network Systems",
        type: "网络产品界面",
        description: "呈现端口、VLAN、PoE 计划、诊断和实时设备状态，在降低操作成本的同时保留系统深度。",
        stack: "VUE / TYPESCRIPT / DATA VIS",
        status: "真实业务",
        href: "#profile",
      },
      {
        code: "OBJ–03",
        title: "Agent Lab",
        type: "AI 智能体系统",
        description: "具备参数校验、工具调用、可靠执行、步骤观测、记忆与明确失败边界的 Agent 运行时。",
        stack: "NEXT.JS / NESTJS / POSTGRESQL",
        status: "开发中",
        href: "#contact",
      },
    ],
    profileLabel: "航行档案",
    profileTitle: "把复杂产品，工程化为清晰体验。",
    profileBody:
      "七年前端经验，覆盖数据平台、产品界面与技术内容。我工作在前端架构与视觉系统之间，让复杂设备逻辑和实时数据成为可信赖的产品体验。",
    capabilities: [
      ["01", "界面系统", "生产级前端架构、设计系统、响应式交付"],
      ["02", "数据与空间", "地理信息、实时数据、WebGL 与 Three.js"],
      ["03", "Agent 工程", "工具执行、编排、记忆、校验与可观测性"],
    ],
    contactLabel: "通讯链路 / 开放",
    contactTitle: "让复杂系统呈现得理所当然。",
    contactBody: "关注深圳资深前端与创意技术方向的工作机会。",
    email: "邮箱地址 / 待补充",
    github: "GITHUB / AJIANGPZ",
  },
};

export function OrbitPortfolio() {
  const [language, setLanguage] = useState<"en" | "zh">("en");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const t = copy[language];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(media.matches);
    syncMotion();
    media.addEventListener("change", syncMotion);

    const updateScroll = () => {
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = maximum > 0 ? window.scrollY / maximum : 0;
      setActiveSection(Math.min(5, Math.floor(progress.current * 6.2)));
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });

    return () => {
      media.removeEventListener("change", syncMotion);
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion || raf.current !== null) return;
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -((event.clientY / window.innerHeight) * 2 - 1);
    raf.current = window.requestAnimationFrame(() => {
      pointer.current = { x, y };
      raf.current = null;
    });
  };

  return (
    <main className={`orbit-site lang-${language}`} onPointerMove={handlePointerMove}>
      <a className="skip-link" href="#work">
        Skip to projects
      </a>
      <SolarScene progress={progress} pointer={pointer} reducedMotion={reducedMotion} />
      <div className="space-noise" aria-hidden="true" />

      <header className="site-header">
        <a className="wordmark" href="#index" aria-label="John Digital Orbit, home">
          <span className="wordmark-mark">J/</span>
          <span>JOHN DIGITAL ORBIT</span>
        </a>
        <nav aria-label="Primary navigation">
          {t.nav.map((item, index) => (
            <a
              href={["#index", "#work", "#profile", "#contact"][index]}
              key={item}
              className={activeSection === index ? "active" : ""}
            >
              <span>0{index + 1}</span> {item}
            </a>
          ))}
        </nav>
        <button
          className="language-toggle"
          type="button"
          onClick={() => setLanguage((current) => (current === "en" ? "zh" : "en"))}
          aria-label={language === "en" ? "Switch to Chinese" : "切换到英文"}
        >
          {language === "en" ? "中" : "EN"}
        </button>
      </header>

      <aside className="orbit-progress" aria-hidden="true">
        <span className="progress-coordinate">22.5431° N</span>
        <div className="progress-line">
          {Array.from({ length: 6 }, (_, index) => (
            <i key={index} className={index === activeSection ? "current" : ""} />
          ))}
        </div>
        <span>114.0579° E</span>
      </aside>

      <section className="hero panel" id="index" aria-labelledby="hero-title">
        <div className="hero-meta mono">
          <span>{t.eyebrow}</span>
          <span>SHENZHEN / CN</span>
        </div>
        <div className="hero-copy">
          <p className="coordinate-mark mono">+ 22.5431° N / 114.0579° E</p>
          <h1 id="hero-title">
            <span>JOHN <em>/</em></span>
            <span>DIGITAL ORBIT</span>
          </h1>
          <p className="role">{t.role}</p>
          <p className="intro">{t.intro}</p>
        </div>
        <div className="scroll-cue mono">
          <span className="scroll-line" />
          {t.scroll}
        </div>
      </section>

      <section className="work-intro panel" id="work" aria-labelledby="work-title">
        <div className="section-index mono">01 / 04</div>
        <div className="section-heading">
          <p className="kicker mono">{t.selected}</p>
          <h2 id="work-title">{t.workLead}</h2>
        </div>
      </section>

      {t.projects.map((project, index) => (
        <section className={`project panel project-${index + 1}`} key={project.code}>
          <div className="object-tag mono">
            <span>{project.code}</span>
            <span>{project.type}</span>
          </div>
          <div className="project-copy">
            <div className="project-number mono">0{index + 1}</div>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <dl className="project-data mono">
              <div>
                <dt>STACK</dt>
                <dd>{project.stack}</dd>
              </div>
              <div>
                <dt>STATUS</dt>
                <dd>{project.status}</dd>
              </div>
            </dl>
            <a className="text-link mono" href={project.href} target={index === 0 ? "_blank" : undefined}>
              VIEW OBJECT <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      ))}

      <section className="profile panel" id="profile" aria-labelledby="profile-title">
        <div className="section-index mono">02 / 04</div>
        <div className="profile-grid">
          <div>
            <p className="kicker mono">{t.profileLabel}</p>
            <h2 id="profile-title">{t.profileTitle}</h2>
          </div>
          <p className="profile-body">{t.profileBody}</p>
        </div>
        <div className="capability-list">
          {t.capabilities.map(([number, title, description]) => (
            <article key={number}>
              <span className="mono">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="contact panel" id="contact">
        <div className="contact-orbit" aria-hidden="true" />
        <p className="kicker mono">{t.contactLabel}</p>
        <h2>{t.contactTitle}</h2>
        <p className="contact-body">{t.contactBody}</p>
        <div className="contact-links">
          <span className="disabled-link mono" aria-label="Email address will be added later">
            {t.email}
          </span>
          <a className="text-link mono" href="https://github.com/ajiangpz" target="_blank" rel="noreferrer">
            {t.github} <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="footer-line mono">
          <span>JOHN / DIGITAL ORBIT</span>
          <span>© 2026</span>
        </div>
      </footer>
    </main>
  );
}

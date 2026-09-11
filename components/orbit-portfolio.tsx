"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Locale = "en" | "zh";
type SceneName = "solar" | "mars" | "saturn" | "void";

const content = {
  en: {
    nav: ["INDEX", "WORK", "PROFILE", "CONTACT"],
    role: "Frontend Engineer & Creative Technologist",
    intro: "I build interfaces where data, motion and systems become visible.",
    scroll: "SCROLL TO NAVIGATE",
    archive: "SOLAR ARCHIVE / 2026",
    projects: [
      { code: "OBJ–01", short: "RAIN SCOPE", title: "RainScope", type: "WEATHER SYSTEM / SHENZHEN", lead: "Weather, rendered as a living spatial system.", body: "Rain bands, wind fields, warnings and time converge in one continuous view—built to make a volatile city forecast readable at a glance.", stack: "MAPLIBRE / ECHARTS / THREE.JS", orbit: "2025—PRESENT", status: "ACTIVE", href: "https://github.com/ajiangpz/sz-weather" },
      { code: "OBJ–02", short: "NETWORK SYSTEMS", title: "Network Systems", type: "PRODUCT INTERFACE / DEVICE OPS", lead: "Operational depth without operational noise.", body: "Product interfaces for ports, VLANs, PoE schedules, diagnostics and live device state—designed around the decisions operators actually make.", stack: "VUE / TYPESCRIPT / DATA VIS", orbit: "2019—PRESENT", status: "FIELD WORK", href: "#profile" },
      { code: "OBJ–03", short: "AGENT LAB", title: "Agent Lab", type: "AI SYSTEMS / TOOL RUNTIME", lead: "Agents you can inspect, interrupt and trust.", body: "A tool-using runtime with validated calls, resilient execution, observable steps, explicit failure boundaries and durable memory.", stack: "NEXT.JS / NESTJS / POSTGRESQL", orbit: "2026—IN DEVELOPMENT", status: "PROTOTYPE", href: "#contact" },
    ],
    profileKicker: "FLIGHT PROFILE / 07 YEARS",
    profileTitle: "Engineering clarity into complex products.",
    profileBody: "Seven years across data platforms, network products and technical communication. I work between frontend architecture and visual systems—turning dense product logic into interfaces people can trust.",
    disciplines: ["INTERFACE ARCHITECTURE", "DATA VISUALIZATION", "CREATIVE TECHNOLOGY", "AGENT ENGINEERING"],
    contactKicker: "TRANSMISSION / OPEN",
    contactTitle: "Make the difficult feel inevitable.",
    contactBody: "Available for senior frontend and creative technology opportunities in Shenzhen.",
    email: "EMAIL / TO BE ADDED",
  },
  zh: {
    nav: ["首页", "项目", "档案", "联系"],
    role: "前端工程师 / 创意技术开发者",
    intro: "让数据、动态与复杂系统，成为清晰可见的界面。",
    scroll: "滚动进入轨道",
    archive: "太阳系档案 / 2026",
    projects: [
      { code: "OBJ–01", short: "RAIN SCOPE", title: "RainScope", type: "天气系统 / 深圳", lead: "让天气成为持续运动的空间系统。", body: "雨带、风场、预警与时间汇聚在同一个连续视图中，让一座多变城市的天气状态可以被快速读懂。", stack: "MAPLIBRE / ECHARTS / THREE.JS", orbit: "2025—至今", status: "持续迭代", href: "https://github.com/ajiangpz/sz-weather" },
      { code: "OBJ–02", short: "NETWORK SYSTEMS", title: "Network Systems", type: "网络产品 / 设备运维", lead: "保留系统深度，减少操作噪声。", body: "围绕真实运维决策设计端口、VLAN、PoE 计划、诊断与实时设备状态，而不是简单罗列参数。", stack: "VUE / TYPESCRIPT / DATA VIS", orbit: "2019—至今", status: "真实业务", href: "#profile" },
      { code: "OBJ–03", short: "AGENT LAB", title: "Agent Lab", type: "AI 系统 / 工具运行时", lead: "让 Agent 可检查、可中断、可信赖。", body: "包含参数校验、可靠执行、步骤观测、明确失败边界与持久记忆的工具调用运行时。", stack: "NEXT.JS / NESTJS / POSTGRESQL", orbit: "2026—开发中", status: "原型阶段", href: "#contact" },
    ],
    profileKicker: "航行档案 / 07 年",
    profileTitle: "把复杂产品，工程化为清晰体验。",
    profileBody: "七年经验覆盖数据平台、网络产品与技术内容。我工作在前端架构与视觉系统之间，把密集的产品逻辑转化为值得信赖的界面。",
    disciplines: ["界面架构", "数据可视化", "创意技术", "AGENT 工程"],
    contactKicker: "通讯链路 / 开放",
    contactTitle: "让困难的系统显得理所当然。",
    contactBody: "关注深圳资深前端与创意技术方向的工作机会。",
    email: "邮箱 / 待补充",
  },
};

const scenes: Array<{ name: Exclude<SceneName, "void">; src: string }> = [
  { name: "solar", src: "/media/solar-hero-v2.webp" },
  { name: "mars", src: "/media/mars-v2.webp" },
  { name: "saturn", src: "/media/saturn-v2.webp" },
];

export function OrbitPortfolio() {
  const [locale, setLocale] = useState<Locale>("en");
  const [activeScene, setActiveScene] = useState<SceneName>("solar");
  const [activeNav, setActiveNav] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const raf = useRef<number | null>(null);
  const t = content[locale];

  useEffect(() => {
    const update = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      const focus = window.innerHeight * 0.5;
      let nearest: HTMLElement | null = null;
      let distance = Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const nextDistance = Math.abs(rect.top + rect.height / 2 - focus);
        if (nextDistance < distance) { distance = nextDistance; nearest = section; }
      }

      setActiveScene((nearest?.dataset.scene ?? "solar") as SceneName);
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maximum > 0 ? window.scrollY / maximum : 0;
      rootRef.current?.style.setProperty("--page-progress", progress.toFixed(4));
      setActiveNav(progress < 0.14 ? 0 : progress < 0.64 ? 1 : progress < 0.84 ? 2 : 3);
      raf.current = null;
    };
    const onScroll = () => { if (raf.current === null) raf.current = window.requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current !== null) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <main className={`orbit-v2 locale-${locale}`} ref={rootRef}>
      <a className="skip-link" href="#work">Skip to work</a>
      <div className="cosmos" aria-hidden="true">
        {scenes.map((scene) => (
          <div className={`cosmos-scene scene-${scene.name} ${activeScene === scene.name ? "is-active" : ""}`} key={scene.name}>
            <Image src={scene.src} alt="" fill sizes="100vw" priority={scene.name === "solar"} />
          </div>
        ))}
        <div className={`cosmos-void ${activeScene === "void" ? "is-active" : ""}`} />
        <div className="cosmos-shade" /><div className="cosmos-grain" />
      </div>

      <header className="site-header">
        <a className="wordmark" href="#index" aria-label="John Digital Orbit, home"><span>J/</span> JOHN DIGITAL ORBIT</a>
        <nav aria-label="Primary navigation">
          {t.nav.map((item, index) => <a className={activeNav === index ? "is-active" : ""} href={["#index", "#work", "#profile", "#contact"][index]} key={item}><b>0{index + 1}</b>{item}</a>)}
        </nav>
        <button className="locale-switch" type="button" onClick={() => setLocale((value) => value === "en" ? "zh" : "en")} aria-label={locale === "en" ? "Switch to Chinese" : "切换到英文"}>{locale === "en" ? "中" : "EN"}</button>
      </header>

      <section className="hero" id="index" data-scene="solar" aria-labelledby="hero-title">
        <div className="hero-meta mono"><span>{t.archive}</span><span>22.5431° N / 114.0579° E</span></div>
        <p className="solar-note mono">A BRIGHTER<br />WEB AWAITS<br />FURTHER OUT</p>
        <div className="hero-copy">
          <h1 id="hero-title"><span>JOHN <em>/</em></span><span>DIGITAL ORBIT</span></h1>
          <p className="hero-role mono">{t.role}</p><div className="hero-rule" /><p className="hero-intro">{t.intro}</p>
        </div>
        <div className="orbit-labels mono" aria-hidden="true">
          {t.projects.map((project, index) => <span className={`orbit-label orbit-label-${index + 1}`} key={project.code}><i /> 0{index + 1} {project.short}</span>)}
        </div>
        <a className="scroll-cue mono" href="#work"><span />{t.scroll}</a>
      </section>

      <div id="work">
        {t.projects.map((project, index) => (
          <section className={`project project-${index + 1} ${index === 1 ? "align-right" : "align-left"}`} data-scene={index === 1 ? "mars" : index === 2 ? "saturn" : "solar"} key={project.code}>
            <div className="project-safe-zone">
              <div className="object-id mono"><span>{project.code}</span><span>{project.type}</span></div>
              <p className="project-index mono">0{index + 1} / 03</p><h2>{project.title}</h2><p className="project-lead">{project.lead}</p><p className="project-body">{project.body}</p>
              <dl className="project-spec mono"><div><dt>STACK</dt><dd>{project.stack}</dd></div><div><dt>ORBIT</dt><dd>{project.orbit}</dd></div><div><dt>STATUS</dt><dd>{project.status}</dd></div></dl>
              <a className="line-link mono" href={project.href} target={index === 0 ? "_blank" : undefined} rel={index === 0 ? "noreferrer" : undefined}>VIEW OBJECT <span>↗</span></a>
            </div>
          </section>
        ))}
      </div>

      <section className="profile" id="profile" data-scene="void" aria-labelledby="profile-title">
        <div className="section-mark mono">02 / PROFILE</div>
        <div className="profile-intro"><p className="kicker mono">{t.profileKicker}</p><h2 id="profile-title">{t.profileTitle}</h2></div>
        <p className="profile-copy">{t.profileBody}</p>
        <ol className="discipline-list">{t.disciplines.map((item, index) => <li key={item}><span className="mono">0{index + 1}</span>{item}</li>)}</ol>
      </section>

      <footer className="contact" id="contact" data-scene="void">
        <div className="contact-cross" aria-hidden="true"><span /><span /></div>
        <p className="kicker mono">{t.contactKicker}</p><h2>{t.contactTitle}</h2><p className="contact-copy">{t.contactBody}</p>
        <div className="contact-actions"><span className="pending-link mono">{t.email}</span><a className="line-link mono" href="https://github.com/ajiangpz" target="_blank" rel="noreferrer">GITHUB / AJIANGPZ <span>↗</span></a></div>
        <div className="footer-meta mono"><span>JOHN / DIGITAL ORBIT</span><span>© 2026</span></div>
      </footer>
    </main>
  );
}

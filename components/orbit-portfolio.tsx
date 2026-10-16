"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

import { useLocale } from "./locale-provider";
import { SiteHeader } from "./site-header";
import { ProjectShowcase } from "./project-showcase";
import { projects } from "@/data/projects";
import { SceneBoundary } from "./scene-boundary";
type SceneName = "solar" | "mars" | "saturn" | "void";

const SolarSystemScene = dynamic(
  () => import("./solar-system-scene").then((module) => module.SolarSystemScene),
  { ssr: false },
);

const content = {
  en: {
    role: "Frontend Engineer & Creative Technologist",
    intro: "I build interfaces where data, motion and systems become visible.",
    scroll: "SCROLL TO NAVIGATE",
    archive: "SOLAR ARCHIVE / 2026",
    profileKicker: "FLIGHT PROFILE / 07 YEARS",
    profileTitle: "Engineering clarity into complex products.",
    profileBody: "Seven years across data platforms, network products and technical communication. I work between frontend architecture and visual systems—turning dense product logic into interfaces people can trust.",
    disciplines: ["INTERFACE ARCHITECTURE", "DATA VISUALIZATION", "CREATIVE TECHNOLOGY", "AGENT ENGINEERING"],
    contactKicker: "TRANSMISSION / OPEN",
    contactTitle: "Make the difficult feel inevitable.",
    contactBody: "Available for senior frontend and creative technology opportunities in Shenzhen.",
  },
  zh: {
    role: "前端工程师 / 创意技术开发者",
    intro: "让数据、动态与复杂系统，成为清晰可见的界面。",
    scroll: "滚动进入轨道",
    archive: "太阳系档案 / 2026",
    profileKicker: "航行档案 / 07 年",
    profileTitle: "把复杂产品，工程化为清晰体验。",
    profileBody: "七年经验覆盖数据平台、网络产品与技术内容。我工作在前端架构与视觉系统之间，把密集的产品逻辑转化为值得信赖的界面。",
    disciplines: ["界面架构", "数据可视化", "创意技术", "AGENT 工程"],
    contactKicker: "通讯链路 / 开放",
    contactTitle: "让困难的系统显得理所当然。",
    contactBody: "关注深圳资深前端与创意技术方向的工作机会。",
  },
};

export function OrbitPortfolio() {
  const { locale } = useLocale();
  const [activeScene, setActiveScene] = useState<SceneName>("solar");
  const [activeNav, setActiveNav] = useState(0);
  const [webglStatus, setWebglStatus] = useState<"checking" | "loading" | "ready" | "failed">("checking");
  const [reducedMotion, setReducedMotion] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const t = content[locale];
  const onSceneReady = useCallback(() => setWebglStatus((status) => status === "failed" ? status : "ready"), []);
  const onSceneFailure = useCallback(() => setWebglStatus("failed"), []);

  useEffect(() => {
    const update = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      const focus = window.innerHeight * 0.45;
      const current = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= focus && rect.bottom > focus;
      }) ?? sections[0];
      setActiveScene((current?.dataset.scene ?? "solar") as SceneName);
      setActiveNav(Number(current?.dataset.nav ?? 0));
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maximum > 0 ? window.scrollY / maximum : 0;
      rootRef.current?.style.setProperty("--page-progress", progress.toFixed(4));
      raf.current = null;
    };
    const onScroll = () => { if (raf.current === null) raf.current = window.requestAnimationFrame(update); };
    update();
    // Font loading, translations and content changes can move sections without a scroll event.
    const observer = new ResizeObserver(onScroll);
    rootRef.current?.querySelectorAll<HTMLElement>("[data-scene]").forEach((section) => observer.observe(section));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current !== null) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      const context = probe.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ?? probe.getContext("webgl", { failIfMajorPerformanceCaveat: false });
      setWebglStatus(context ? "loading" : "failed");
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setWebglStatus("failed");
    }
  }, []);

  return (
    <div className={`orbit-v2 locale-${locale}`} ref={rootRef}>
      <a className="skip-link" href="#work">{locale === "en" ? "Skip to work" : "跳转到作品"}</a>
      <div className={`cosmos webgl-${webglStatus}`} aria-hidden="true">
        <div className={`cosmos-fallback fallback-${activeScene}`} />
        {(webglStatus === "loading" || webglStatus === "ready") && (
          <SceneBoundary onFailure={onSceneFailure}><SolarSystemScene
            activeScene={activeScene}
            reducedMotion={reducedMotion}
            onReady={onSceneReady}
            onFailure={onSceneFailure}
          /></SceneBoundary>
        )}
        <div className="cosmos-shade" /><div className="cosmos-grain" />
      </div>

      <SiteHeader home activeNav={activeNav} />

      <main>
      <section className="hero" id="index" data-scene="solar" data-nav="0" aria-labelledby="hero-title">
        <div className="hero-meta mono"><span>{t.archive}</span><span>22.5431° N / 114.0579° E</span></div>
        <p className="solar-note mono">A BRIGHTER<br />WEB AWAITS<br />FURTHER OUT</p>
        <div className="hero-copy">
          <h1 id="hero-title"><span>JOHN <em>/</em></span><span>DIGITAL ORBIT</span></h1>
          <p className="hero-role mono">{t.role}</p><div className="hero-rule" /><p className="hero-intro">{t.intro}</p>
        </div>
        <div className="orbit-labels mono" aria-hidden="true">
          {projects.map((project, index) => <span className={`orbit-label orbit-label-${index + 1}`} key={project.code}><i /> 0{index + 1} {project.short}</span>)}
        </div>
        <a className="scroll-cue mono" href="#work"><span />{t.scroll}</a>
      </section>

      <div id="work" tabIndex={-1}>
        {projects.map((project, index) => <ProjectShowcase project={project} index={index} locale={locale} key={project.slug} />)}
      </div>

      <section className="profile" id="profile" data-scene="void" data-nav="2" aria-labelledby="profile-title">
        <div className="section-mark mono">02 / PROFILE</div>
        <div className="profile-intro"><p className="kicker mono">{t.profileKicker}</p><h2 id="profile-title">{t.profileTitle}</h2></div>
        <p className="profile-copy">{t.profileBody}</p>
        <ol className="discipline-list">{t.disciplines.map((item, index) => <li key={item}><span className="mono">0{index + 1}</span>{item}</li>)}</ol>
      </section>

      </main>
      <footer className="contact" id="contact" data-scene="void" data-nav="3">
        <div className="contact-cross" aria-hidden="true"><span /><span /></div>
        <p className="kicker mono">{t.contactKicker}</p><h2>{t.contactTitle}</h2><p className="contact-copy">{t.contactBody}</p>
        <div className="contact-actions"><a className="line-link mono" href="https://github.com/ajiangpz" target="_blank" rel="noreferrer">GITHUB / AJIANGPZ <span>↗</span></a></div>
        <div className="footer-meta mono"><span>JOHN / DIGITAL ORBIT</span><span>© 2026</span></div>
      </footer>
    </div>
  );
}

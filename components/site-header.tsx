"use client";

import Link from "next/link";
import { useLocale } from "./locale-provider";

export function SiteHeader({ activeNav = 1, home = false }: { activeNav?: number; home?: boolean }) {
  const { locale, toggleLocale } = useLocale();
  const labels = locale === "en" ? ["INDEX", "WORK", "PROFILE", "CONTACT"] : ["首页", "项目", "档案", "联系"];
  const sections = ["index", "work", "profile", "contact"];
  return <header className="site-header">
    <Link className="wordmark" href={home ? "#index" : "/"} aria-label={locale === "en" ? "John Digital Orbit, home" : "John Digital Orbit，首页"}><span>J/</span> JOHN DIGITAL ORBIT</Link>
    <nav aria-label={locale === "en" ? "Primary navigation" : "主导航"}>
      {labels.map((label, index) => <Link key={sections[index]} href={`${home ? "" : "/"}#${sections[index]}`} className={activeNav === index ? "is-active" : ""} aria-current={activeNav === index ? (home ? "location" : "page") : undefined}><b aria-hidden="true">0{index + 1}</b>{label}</Link>)}
    </nav>
    <button className="locale-switch" type="button" onClick={toggleLocale} aria-label={locale === "en" ? "Switch to Chinese" : "切换到英文"}>{locale === "en" ? "中" : "EN"}</button>
  </header>;
}

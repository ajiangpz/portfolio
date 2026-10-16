"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { useLocale } from "@/components/locale-provider";

export default function NotFound() {
  const { locale } = useLocale();
  return <div className="case-page"><SiteHeader /><main className="not-found"><p className="kicker mono">404 / OBJECT NOT FOUND</p><h1>{locale === "en" ? "Outside the archive." : "档案中未找到此作品。"}</h1><Link className="line-link mono" href="/#work">{locale === "en" ? "RETURN TO WORK" : "返回作品列表"} ↗</Link></main></div>;
}

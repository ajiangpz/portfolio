import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "John / Digital Orbit",
  description:
    "Frontend and AI Agent engineer building interfaces where data, motion and intelligent systems become visible.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

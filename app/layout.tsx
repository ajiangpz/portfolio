import type { Metadata, Viewport } from "next";
import { LocaleProvider } from "@/components/locale-provider";
import "@fontsource/ibm-plex-sans/300.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-mono/400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "John / Digital Orbit", template: "%s | John / Digital Orbit" },
  description:
    "Frontend engineer and creative technologist working across data visualization, network systems, and AI agents.",
};

export const viewport: Viewport = {
  themeColor: "#030405",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><LocaleProvider>{children}</LocaleProvider></body>
    </html>
  );
}

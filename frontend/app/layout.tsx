import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import { NavBar } from "@/components/dashboard/NavBar";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Atlas · Feed Health Overview",
  description:
    "A constructive self-monitoring dashboard for masculine-ideology content exposure across social feeds.",
};

/**
 * Stamps data-theme before first paint so the page never flashes the wrong
 * theme. Defaults to light rather than to the OS setting, so the app looks
 * the same on every browser; the toggle in the nav overrides and persists.
 */
const themeInit = `(function(){try{var t=localStorage.getItem('atlas-theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light')}catch(e){document.documentElement.setAttribute('data-theme','light')}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="bg-ground font-body text-ink antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";
import { basics } from "@/data/resume";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  // Required for the generated opengraph-image to resolve to an absolute URL —
  // without it Next emits a relative path that most scrapers will not follow.
  metadataBase: new URL("https://bhavyajain1.github.io"),
  title: `${basics.name} — ${basics.title}`,
  description: basics.heroSummary,
  openGraph: {
    title: `${basics.name} — ${basics.title}`,
    description: basics.heroSummary,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05070f" },
    { media: "(prefers-color-scheme: light)", color: "#f7f9fc" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

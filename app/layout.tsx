import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { MotionReady } from "@/components/layout/MotionReady";
import { MotionScript } from "@/components/layout/MotionScript";
import { siteConfig } from "@/lib/site";
import "@/styles/globals.css";

// Display face for headings and storytelling only; Manrope does all functional UI.
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Kenya safaris and beach holidays`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/brand/favicon-32.png",
    apple: "/brand/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#14261e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the intro script sets a data attribute on <html> before hydration.
    <html lang={siteConfig.locale} className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body>
        <MotionScript />
        <MotionReady />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

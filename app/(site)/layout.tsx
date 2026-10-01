import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { IntroLoader } from "@/components/layout/IntroLoader";
import { IntroScript } from "@/components/layout/IntroScript";
import { Navigation } from "@/components/navigation/Navigation";
import { getSiteSettings } from "@/lib/content";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { contact } = await getSiteSettings();

  return (
    <>
      <IntroScript />
      <IntroLoader />
      <Navigation phone={contact.phone} whatsapp={contact.whatsapp} />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}

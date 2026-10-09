import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalArticle } from "@/components/layout/LegalArticle";
import { getLegalPage, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "How a trip request becomes a booking with Tayari Africa Tours Consultants, how payment works, and what each of us is responsible for.",
};

export default async function TermsOfServicePage() {
  const [page, site] = await Promise.all([getLegalPage("terms"), getSiteSettings()]);
  if (!page) notFound();
  return <LegalArticle page={page} image={site.pageImages.legal} />;
}

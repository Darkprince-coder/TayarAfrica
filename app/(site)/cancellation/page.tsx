import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalArticle } from "@/components/layout/LegalArticle";
import { getLegalPage, getSiteSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description: "What happens if you need to cancel a trip booked with Tayari Africa Tours Consultants, and how refunds work.",
};

export default async function CancellationPolicyPage() {
  const [page, site] = await Promise.all([getLegalPage("cancellation"), getSiteSettings()]);
  if (!page) notFound();
  return <LegalArticle page={page} image={site.pageImages.legal} />;
}

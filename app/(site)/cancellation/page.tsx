import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalArticle } from "@/components/layout/LegalArticle";
import { getLegalPage, getSiteSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    path: "/cancellation",
    title: "Cancellation Policy",
    description: "What happens if you need to cancel a trip booked with Tayari Africa Tours Consultants, and how refunds work.",
    image: site.pageImages.legal,
  });
}

export default async function CancellationPolicyPage() {
  const [page, site] = await Promise.all([getLegalPage("cancellation"), getSiteSettings()]);
  if (!page) notFound();
  return <LegalArticle page={page} image={site.pageImages.legal} />;
}

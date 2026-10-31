import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalArticle } from "@/components/layout/LegalArticle";
import { getLegalPage, getSiteSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    path: "/cancellation",
    title: "Cancellation and Refund Policy",
    description: "Cancellation fees, payment terms, date changes and refunds for trips booked with Tayari Africa Tours Consultants.",
    image: site.pageImages.legal,
  });
}

export default async function CancellationPolicyPage() {
  const [page, site] = await Promise.all([getLegalPage("cancellation"), getSiteSettings()]);
  if (!page) notFound();
  return <LegalArticle page={page} image={site.pageImages.legal} />;
}

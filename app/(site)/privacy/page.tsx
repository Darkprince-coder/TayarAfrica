import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalArticle } from "@/components/layout/LegalArticle";
import { getLegalPage, getSiteSettings } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return pageMeta({
    path: "/privacy",
    title: "Privacy Policy",
    description: "What Tayari Africa Tours Consultants collects when you request a trip or contact us, why, who it is shared with, and your rights.",
    image: site.pageImages.legal,
  });
}

export default async function PrivacyPolicyPage() {
  const [page, site] = await Promise.all([getLegalPage("privacy"), getSiteSettings()]);
  if (!page) notFound();
  return <LegalArticle page={page} image={site.pageImages.legal} />;
}

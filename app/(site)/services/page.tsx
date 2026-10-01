import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Services" };

export default function Page() {
  return <PagePlaceholder title="Services" phase="Phase 4" />;
}

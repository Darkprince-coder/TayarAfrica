import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Meet the Team" };

export default function Page() {
  return <PagePlaceholder title="Meet the Team" phase="Phase 4" />;
}

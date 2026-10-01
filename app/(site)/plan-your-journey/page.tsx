import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Plan Your Journey" };

export default function Page() {
  return <PagePlaceholder title="Plan Your Journey" phase="Phase 5" />;
}

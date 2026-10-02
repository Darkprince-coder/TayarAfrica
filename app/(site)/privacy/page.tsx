import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  return <PagePlaceholder title="Privacy Policy" phase="Legal" note="The privacy policy will be supplied by Tayari before launch." />;
}

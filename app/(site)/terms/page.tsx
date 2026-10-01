import type { Metadata } from "next";
import { PagePlaceholder } from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Terms of Service" };

export default function Page() {
  return <PagePlaceholder title="Terms of Service" phase="Legal" note="The terms of service will be supplied by TAYARI before launch." />;
}

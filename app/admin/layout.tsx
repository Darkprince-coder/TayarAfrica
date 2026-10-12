import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Tayari admin" },
  robots: { index: false, follow: false },
};

/** The team's back office. Sits outside the public site layout: no site navigation or footer. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}

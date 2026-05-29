import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zachariahammad.com"),
  title: "Zacharia Hammad — Full-Stack AI Engineer",
  description:
    "Full-Stack AI Engineer building agents, retrieval systems, computer vision pipelines, infrastructure, and low-level systems foundations.",
  keywords: [
    "full-stack ai engineer",
    "AI agents",
    "retrieval systems",
    "computer vision",
    "RISC-V",
    "Rust",
    "systems programming",
    "portfolio",
  ],
  authors: [{ name: "Zacharia Hammad" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Zacharia Hammad — Full-Stack AI Engineer",
    description:
      "Building AI systems end to end: agents, retrieval, computer vision, infrastructure, and systems foundations.",
    url: "/",
    siteName: "Zacharia Hammad",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zacharia Hammad — Full-Stack AI Engineer",
    description:
      "Building AI systems end to end: agents, retrieval, computer vision, infrastructure, and systems foundations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}

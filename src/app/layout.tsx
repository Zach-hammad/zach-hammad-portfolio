import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://zachariahammad.com"),
  title: "Zacharia Hammad — AI Products & Systems",
  description:
    "Software engineer building AI products, computer-vision pipelines, knowledge graphs, and Rust runtimes. Computer engineering foundations, from RISC-V to ASIC design.",
  authors: [{ name: "Zacharia Hammad" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Zacharia Hammad — AI Products & Systems",
    description:
      "AI products. Systems thinking. Selected work in computer vision, voice agents, knowledge graphs, and computer architecture.",
    url: "/",
    siteName: "Zacharia Hammad",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Zacharia Hammad — AI Products & Systems",
    description:
      "AI products. Systems thinking. From the product people use to the runtime underneath.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

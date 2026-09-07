import type { Metadata } from "next";
import { site } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  authors: [{ name: "Zacharia Hammad" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    siteName: "Zacharia Hammad",
    type: "website",
    locale: "en_US",
    images: [site.socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.socialImage],
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

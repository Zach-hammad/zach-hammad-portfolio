import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zacharia Hammad — Computer Engineer",
  description:
    "Computer Engineer building from transistors to interfaces. Hardware design, systems programming, and production software engineering.",
  keywords: [
    "computer engineer",
    "RISC-V",
    "CPU design",
    "Rust",
    "systems programming",
    "portfolio",
  ],
  authors: [{ name: "Zacharia Hammad" }],
  openGraph: {
    title: "Zacharia Hammad — Computer Engineer",
    description:
      "Computer Engineer building from transistors to interfaces.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zacharia Hammad — Computer Engineer",
    description:
      "Computer Engineer building from transistors to interfaces.",
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

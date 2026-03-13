import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zacharia Hammad — Computer Engineer",
  description:
    "Computer Engineer building from transistors to interfaces. Portfolio showcasing hardware design, systems programming, and software engineering.",
  openGraph: {
    title: "Zacharia Hammad — Computer Engineer",
    description:
      "Computer Engineer building from transistors to interfaces.",
    type: "website",
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

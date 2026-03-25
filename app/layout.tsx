import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TinyNotes",
  description: "Private notes with secure sharing, built around React Server Components and Server Actions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

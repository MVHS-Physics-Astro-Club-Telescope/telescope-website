import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MVHS Physics & Astronomy Club — Autonomous Telescope Project",
  description:
    "A student-built autonomous telescope bringing the night sky to the Bay Area. Built by 7 high school students at Mountain View High School.",
  keywords: [
    "telescope",
    "astronomy",
    "MVHS",
    "Mountain View High School",
    "autonomous telescope",
    "star party",
    "STEM",
    "physics club",
    "Dobsonian",
    "astrophotography",
  ],
  authors: [{ name: "MVHS Physics & Astronomy Club" }],
  openGraph: {
    title: "MVHS Physics & Astronomy Club — Autonomous Telescope Project",
    description:
      "A student-built autonomous telescope bringing the night sky to the Bay Area.",
    type: "website",
    locale: "en_US",
    siteName: "MVHS Astronomy",
  },
  twitter: {
    card: "summary_large_image",
    title: "MVHS Physics & Astronomy Club — Autonomous Telescope Project",
    description:
      "A student-built autonomous telescope bringing the night sky to the Bay Area.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#080B12] text-[rgba(240,240,250,1)]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          theme="dark"
          richColors
          closeButton
          offset={20}
        />
      </body>
    </html>
  );
}

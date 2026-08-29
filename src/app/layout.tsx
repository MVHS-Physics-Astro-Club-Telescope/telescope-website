import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const archivo = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MV Physics & Astronomy Club — Autonomous Telescope Project",
  description:
    "A student-built autonomous telescope bringing the night sky to the Bay Area. An independent project by 7 high schoolers in Mountain View, California.",
  keywords: [
    "telescope",
    "astronomy",
    "MV Astronomy",
    "Mountain View CA",
    "autonomous telescope",
    "star party",
    "STEM",
    "physics club",
    "Dobsonian",
    "astrophotography",
  ],
  authors: [{ name: "MV Physics & Astronomy Club" }],
  openGraph: {
    title: "MV Physics & Astronomy Club — Autonomous Telescope Project",
    description:
      "A student-built autonomous telescope bringing the night sky to the Bay Area.",
    type: "website",
    locale: "en_US",
    siteName: "MV Astronomy",
  },
  twitter: {
    card: "summary_large_image",
    title: "MV Physics & Astronomy Club — Autonomous Telescope Project",
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
      className={`${archivo.variable} ${plexMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-starlight">
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

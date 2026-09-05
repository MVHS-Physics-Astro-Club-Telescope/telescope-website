import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";

const body = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const data = IBM_Plex_Mono({
  variable: "--font-data",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const description =
  "A 10-inch telescope that aims itself, designed and built by eight high-school students in Mountain View, California.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mvhsastro.org"),
  title: {
    default: "MV Astronomy",
    template: "%s — MV Astronomy",
  },
  description,
  keywords: [
    "telescope",
    "astronomy",
    "MV Astronomy",
    "Mountain View CA",
    "autonomous telescope",
    "star party",
    "Dobsonian",
    "astrophotography",
  ],
  openGraph: {
    title: "MV Astronomy",
    description,
    type: "website",
    locale: "en_US",
    siteName: "MV Astronomy",
    images: [{ url: "/og.jpg", width: 1600, height: 900, alt: "The MV Astronomy telescope" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MV Astronomy",
    description,
    images: ["/og.jpg"],
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
      className={`${body.variable} ${data.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster position="bottom-right" theme="dark" closeButton offset={20} />
      </body>
    </html>
  );
}

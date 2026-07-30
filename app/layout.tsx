import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOSchema from "@/components/shared/SEOSchema";
import { getOrganizationSchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL("https://scotlandtamilsraise.org"),
  title: {
    default:
      "Scotland Tamils Raise | Preserving Heritage & Empowering Community in Scotland",
    template: "%s | Scotland Tamils Raise",
  },
  description:
    "Scotland Tamils Raise is the leading Tamil community organization across Edinburgh, Glasgow, Aberdeen, and Dundee. Celebrating Tamil heritage, festival events, Tamil school academy, and civic integration.",
  keywords: [
    "Tamil community Scotland",
    "Tamil association Edinburgh",
    "Tamil association Glasgow",
    "Scotland Tamils Raise",
    "Pongal festival Scotland",
    "Tamil school Scotland",
    "Scottish Tamil diaspora",
    "Tamil New Year Glasgow",
  ],
  authors: [{ name: "Scotland Tamils Raise" }],
  creator: "Scotland Tamils Raise",
  publisher: "Scotland Tamils Raise",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://scotlandtamilsraise.org",
    title: "Scotland Tamils Raise | Preserving Heritage & Empowering Community",
    description:
      "Bridging Tamil heritage and Scottish culture. Join events, language academy, youth mentorship, and community networking across Scotland.",
    siteName: "Scotland Tamils Raise",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Scotland Tamils Raise logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scotland Tamils Raise",
    description:
      "Preserving Tamil heritage and promoting cultural unity in Scotland.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = getOrganizationSchema();

  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <SEOSchema schema={orgSchema} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0A1440] text-slate-100 antialiased font-sans">
        <Navbar />
        <main className="flex-1 pt-20 md:pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

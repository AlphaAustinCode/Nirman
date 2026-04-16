import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroller from "@/components/SmoothScroller";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eendhan Bandhu",
    template: "%s | Eendhan Bandhu",
  },
  description: "Community-powered LPG sharing platform with a clean, secure, and modern user experience.",
  keywords: [
    "Eendhan Bandhu",
    "LPG platform",
    "LPG sharing",
    "gas booking",
    "community platform",
    "secure login",
    "LPG registration",
  ],
  applicationName: "Eendhan Bandhu",
  authors: [{ name: "Eendhan Bandhu Team" }],
  creator: "Eendhan Bandhu",
  metadataBase: new URL("http://localhost:3000"),
  openGraph: {
    title: "Eendhan Bandhu",
    description: "Community-powered LPG sharing platform",
    siteName: "Eendhan Bandhu",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eendhan Bandhu",
    description: "Community-powered LPG sharing platform",
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
      suppressHydrationWarning
      className={`${inter.variable} ${robotoMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-blue-200/60 selection:text-slate-900">
        <div className="relative flex min-h-screen flex-col">
          <SmoothScroller>
            <main className="flex-1">{children}</main>
          </SmoothScroller>
        </div>
      </body>
    </html>
  );
}
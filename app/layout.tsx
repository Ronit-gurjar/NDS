// app/layout.tsx
import type { Metadata } from "next";
import { AR_One_Sans, Poppins } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const arOneSans = AR_One_Sans({
  variable: "--font-ar-one-sans",
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: "--font-poppins",
});

// --- UPDATED METADATA ---
export const metadata: Metadata = {
  // Base URL for your site - VERY IMPORTANT for absolute paths in Open Graph/Twitter
  // Replace with your actual domain when deploying!
  metadataBase: new URL('https://signalhunt-six.vercel.app/'),

  // Primary SEO Tags
  title: {
    default: 'Signal Hunt - Expert Trading Signals for Consistent Growth',
    template: '%s | Signal Hunt', // Used for pages with specific titles (e.g., "Login | Signal Hunt")
  },
  description: 'Harness the power of expert trading without the daily grind. SignalHunt delivers meticulously researched, AI-powered signals and strategies across diverse markets for a proven path to consistent growth.',
  keywords: ['trading agency', 'forex signals', 'crypto signals', 'stock signals', 'AI trading', 'algorithmic trading', 'passive income trading', 'financial growth', 'investing', 'market analysis', 'trade signals India', 'best trading signals'], // Added more specific keywords
  authors: [{ name: 'Signal Hunt Team', url: 'https://signalhunt-six.vercel.app/' }], // Update URL
  creator: 'Signal Hunt',
  publisher: 'Signal Hunt',
  // Canonical URL (optional, but good for SEO if content might be duplicated)
  alternates: {
    canonical: 'https://signalhunt-six.vercel.app/', // Update URL
  },

  // Open Graph / Facebook / LinkedIn / WhatsApp Sharing Tags
  openGraph: {
    title: 'Signal Hunt - Expert Trading Signals for Consistent Growth',
    description: 'Harness the power of expert trading without the daily grind. SignalHunt delivers meticulously researched, AI-powered signals and strategies across diverse markets for a proven path to consistent growth.',
    url: 'https://signalhunt-six.vercel.app/', // Update URL
    siteName: 'Signal Hunt',
    images: [
      {
        url: '/og-image.jpg', // Path to your Open Graph image in `public` directory
        width: 1200,
        height: 630,
        alt: 'Signal Hunt - Trading Success and Growth',
      },
      // You can add more images here if needed
    ],
    locale: 'en_US',
    type: 'website', // Most common type for a landing page
  },

  // Twitter Card Tags
  twitter: {
    card: 'summary_large_image', // Use 'summary_large_image' for a prominent image
    site: '@signal_hunt', // Replace with your agency's actual Twitter handle
    creator: '@signal_hunt', // Replace with your agency's actual Twitter handle
    title: 'Signal Hunt Agency - Expert Trading Signals for Consistent Growth',
    description: 'Harness the power of expert trading without the daily grind. SignalHunt delivers meticulously researched, AI-powered signals and strategies across diverse markets for a proven path to consistent growth.',
  },

  // Favicons and Web App Manifest
  icons: {
    icon: '/favicon.ico', // Standard favicon
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${arOneSans.variable} ${poppins.variable} antialiased`}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          <Toaster richColors />
      </body>
    </html>
  );
}
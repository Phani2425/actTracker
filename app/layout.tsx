import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { ConvexClientProvider } from "./ConvexClientProvider";
import "./globals.css";
import Header from "./Header";

export const metadata: Metadata = {
  title: "ActTracker",
  description: "Track your consistency",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <Header />

            {children}
            <Toaster />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

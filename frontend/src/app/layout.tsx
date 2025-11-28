import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/components/providers/auth-provider";
import RouteLoader from "@/components/RouteLoader"; // ✅ Replaces GlobalLoaderWrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mental Health Tracker - Your Emotional Wellness Companion",
  description:
    "Track your mood, analyze your emotions, and improve your mental wellness with AI-powered insights.",
  keywords: [
    "mental health",
    "mood tracking",
    "emotional wellness",
    "AI therapy",
    "voice analysis",
  ],
  authors: [{ name: "MindfulTrack Team" }],
  openGraph: {
    title: "MindfulTrack",
    description: "Your personal emotional wellness companion",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {/* ✅ Automatically shows blur loader between page transitions */}
          <RouteLoader>
            {children}

            {/* ✅ Toast notifications for global feedback */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </RouteLoader>
        </AuthProvider>
      </body>
    </html>
  );
}

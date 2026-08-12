import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RadioWorld - Radio y Música de Todo el Mundo",
  description: "Escucha estaciones de radio de todo el mundo, descubre artistas y disfruta la mejor música. Organizada por país, género y ciudad.",
  keywords: ["RadioWorld", "radio online", "estaciones de radio", "música", "artistas", "streaming", "radio en vivo"],
  authors: [{ name: "RadioWorld" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "RadioWorld - Radio y Música de Todo el Mundo",
    description: "Descubre miles de estaciones de radio y artistas de todo el mundo",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

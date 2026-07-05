import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Swasthya — AI-Powered Healthcare Intelligence Platform",
  description: "Empowering PHCs, CHCs, and health administrations with secure blockchain logs, real-time resource modeling, and predictive epidemiological outbreak forecasting.",
  keywords: ["Swasthya", "Healthcare SaaS", "AI Outbreak Forecasting", "Blockchain Health Records", "Command Center", "Digital Twin Healthcare"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-base text-txt-main">
        {children}
      </body>
    </html>
  );
}

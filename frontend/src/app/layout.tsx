import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Digimation Flight 3.0 | AI-Powered Innovation, Learning & Career Hub",
  description: "An intelligent, end-to-end full-stack platform providing AI consulting, professional academy courses, simulated internships, ATS resume analysis, and interactive AI career roadmaps.",
  keywords: ["AI Careers", "Machine Learning Academy", "AI Resume Analyzer", "Personalized Learning Roadmap", "SaaS Services", "Hackathon Careers", "Express MongoDB Stack"],
  openGraph: {
    title: "Digimation Flight 3.0 | AI-Powered Innovation & Career Hub",
    description: "Accelerate your career using interactive AI Roadmaps, real-time ATS Resume scoring, and industrial projects.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

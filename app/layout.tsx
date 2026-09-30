import type { Metadata } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const mono = Space_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "700"] });

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "localhost:3000";
  const origin = `${host.startsWith("localhost") ? "http" : "https"}://${host}`;
  const title = "Dedharya — Social Media & Creative";
  const description = "Creative digital portfolio of Dedharya Immanuella Wardjanan, a Social Media Specialist, Content Strategist, and Creative Thinker based in Jakarta.";
  const images = [`${origin}/assets/projects/01-coarse-and-fine/images/cover.webp`];
  return { title, description, openGraph: { title, description, images }, twitter: { card: "summary_large_image", title, description, images } };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${mono.variable}`}><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}

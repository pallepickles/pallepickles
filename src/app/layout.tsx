import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Lora, Manrope } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";

const bodyFont = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const displayFont = Lora({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "Palle Pickles | Prathi muddhalo palle flavour",
  description: "Hand-made Telugu pickles from the Palle Pickles village kitchen. Find your favourite and order worldwide.",
  openGraph: {
    title: "Palle Pickles — a little taste of home",
    description: "Traditional Telugu pickles, made in small batches and shipped worldwide.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="en"><body className={`${bodyFont.variable} ${displayFont.variable}`}><Providers>{children}</Providers></body></html>;
}

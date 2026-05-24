import type { Metadata } from "next";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";

export const metadata: Metadata = {
  title: "ClgMart - College Campus Student Marketplace",
  description: "Buy, sell, and trade textbooks, electronics, and college essentials safely with verified students on campus. No shipping fees, no hassles.",
  keywords: ["college marketplace", "student peer to peer trading", "buy textbooks college", "sell books campus", "verified college network", "ClgMart app"],
};

export default function Page() {
  return (
    <div className="overflow-x-hidden w-full min-h-screen">
      <CinematicHero />
    </div>
  );
}

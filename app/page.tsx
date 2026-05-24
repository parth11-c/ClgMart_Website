import type { Metadata } from "next";
import { CinematicHero } from "@/components/ui/cinematic-landing-hero";

export const metadata: Metadata = {
  title: "ClgMart - College Campus Student Marketplace",
  description: "ClgMart is a verified campus-exclusive marketplace for students to buy, sell, and exchange books, electronics, accessories, and hostel items.",
  keywords: ["college marketplace", "student peer to peer trading", "buy textbooks college", "sell books campus", "verified college network", "ClgMart app", "student marketplace"],
};

export default function Page() {
  return (
    <div className="overflow-x-hidden w-full min-h-screen">
      <CinematicHero />
    </div>
  );
}

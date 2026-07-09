import type { Metadata } from "next";
import { LandingNavbar } from "@/components/LandingNavbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Going Genius — Group of Companies",
  description:
    "We build world-class digital products, services, and experiences.",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

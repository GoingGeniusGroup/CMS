import type { Metadata } from "next";

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
  return <div className="min-h-screen bg-white">{children}</div>;
}

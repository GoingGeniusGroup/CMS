"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicTeamMembers } from "@/app/actions/team";

type TeamMember = {
  id: string;
  fullName: string;
  role: string | null;
  department: string | null;
  image: string | null;
  bio: string | null;
  location: string | null;
  experience: string | null;
  skills: string[];
  email: string;
  phone: string | null;
};

export function LandingTeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getPublicTeamMembers().then((data) => setMembers(data));
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  if (members.length === 0) return null;

  return (
    <section id="company" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Our Team
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-900">
              Meet the Geniuses
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-indigo-600 hover:text-indigo-600"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-indigo-600 hover:text-indigo-600"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {members.map((member) => (
            <div
              key={member.id}
              className="min-w-[200px] max-w-[200px] flex-shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-square w-full bg-zinc-50">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.fullName}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100">
                    <span className="text-3xl font-extrabold text-indigo-300">
                      {member.fullName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 text-center">
                <p className="text-sm font-bold text-zinc-900">{member.fullName}</p>
                <p className="text-xs text-zinc-500">{member.role || member.department || "Team Member"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

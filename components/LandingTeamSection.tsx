"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getPublicTeamMembers } from "@/app/actions/team";

type TeamMember = {
  id: string;
  fullName: string;
  role: string | null;
  department: string | null;
  image: string | null;
};

export function LandingTeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    getPublicTeamMembers().then((data) => setMembers(data));
  }, []);

  if (members.length === 0) return null;

  const displayMembers = members.slice(0, 4);

  return (
    <section id="company" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-600">
          Our Team
        </p>
        <h2 className="mt-2 text-center text-2xl font-extrabold text-zinc-900">
          Meet the Geniuses
        </h2>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {displayMembers.map((member) => (
            <div
              key={member.id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-zinc-50">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.fullName}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
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

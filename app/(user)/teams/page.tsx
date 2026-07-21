"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Users } from "lucide-react";
import { getPublicTeamMembers } from "@/app/actions/team";
import TeamMemberModal from "@/components/TeamMemberModal";

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
  facebook?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  website?: string | null;
};



/* ─── Team Section with Grid ─────────────────────────────── */
function TeamSection({
  title,
  members,
  onMemberClick,
}: {
  title: string;
  members: TeamMember[];
  onMemberClick: (member: TeamMember) => void;
}) {
  if (members.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6">{title}</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => onMemberClick(member)}
            className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition group"
          >
            <div className="relative aspect-square w-full bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
              {member.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.image}
                  alt={member.fullName}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-4xl font-extrabold text-indigo-200">{member.fullName.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="p-4 text-center">
              <p className="text-sm font-bold text-gray-900">{member.fullName}</p>
              <p className="text-xs text-gray-500">{member.role || "Team Member"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function TeamsPage() {
  const [allMembers, setAllMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getPublicTeamMembers().then((data) => setAllMembers(data as TeamMember[]));
  }, []);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  // Filter by search
  const filtered = searchQuery.trim()
    ? allMembers.filter(
        (m) =>
          m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.role && m.role.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allMembers;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center relative">
          <div className="flex flex-col items-center">
            <span className="inline-block rounded-full bg-indigo-50 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-3">
              Our Team
            </span>
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Meet Our Amazing Team
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
              A diverse group of passionate professionals working together to create
              extraordinary digital solutions.
            </p>
          </div>
        </div>
      </section>

      {/* ── Search ──────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search team member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full border border-gray-300 bg-white py-1.5 pl-8 pr-4 text-xs text-gray-700 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 w-48"
            />
          </div>
        </div>
      </section>

      {/* ── Team Grid ────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <TeamSection title="Our Team" members={filtered} onMemberClick={handleMemberClick} />

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No team members found.</p>
          </div>
        )}
      </section>

      {/* ── Join CTA ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/80 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
              <Users className="h-5 w-5 text-indigo-600" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">Want to join our genius team?</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                We&apos;re always looking for talented people who are passionate about what they do.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/career" className="rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700">
              View Open Positions
            </Link>
            <Link href="/career" className="rounded-full border border-gray-300 px-5 py-2 text-xs font-semibold text-gray-700 transition hover:border-indigo-600/40">
              Send Your CV
            </Link>
          </div>
        </div>
      </section>

      {/* ── Team Member Modal ────────────────────────────── */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

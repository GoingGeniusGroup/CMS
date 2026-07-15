/*  */"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import TeamMemberModal from "@/components/TeamMemberModal";

type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
};

/* ─── Static Data ────────────────────────────────────────── */
const leadershipTeam = [
  { id: "1", name: "John Doe", role: "CEO", image: "/member-card-1.png" },
  { id: "2", name: "John Doe", role: "CEO", image: "/member-card-2.png" },
  { id: "3", name: "John Doe", role: "CEO", image: "/member-card-1.png" },
  { id: "4", name: "John Doe", role: "CEO", image: "/member-card-2.png" },
];

const developmentTeam = [
  { id: "5", name: "John Doe", role: "Frontend Developer", image: "/member-card-1.png" },
  { id: "6", name: "John Doe", role: "Frontend Developer", image: "/member-card-2.png" },
  { id: "7", name: "John Doe", role: "Frontend Developer", image: "/member-card-1.png" },
  { id: "8", name: "John Doe", role: "Frontend Developer", image: "/member-card-2.png" },
];

const filterTabs = ["All", "Leadership", "Development", "Design", "Marketing"];

/* ─── Team Section with Carousel ─────────────────────────── */
function TeamSection({
  title,
  members,
  onMemberClick,
}: {
  title: string;
  members: TeamMember[];
  onMemberClick: (member: TeamMember) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-indigo-600 hover:text-indigo-600"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-indigo-600 hover:text-indigo-600"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => onMemberClick(member)}
            className="min-w-[200px] max-w-[200px] flex-shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function TeamsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center relative">
          <div className="flex flex-col items-center">
            <span className="inline-block rounded-full bg-indigo-50 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-indigo-600 mb-3">
              Our Team
            </span>
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Meet Our Amazing Team
              </h1>
              <div className="hidden sm:block">
                <Image
                  src="/teams.png"
                  alt="Team illustration"
                  width={120}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500">
              A diverse group of passionate professionals working together to create
              extraordinary digital solutions. We combine technical excellence with creative
              vision.
            </p>
          </div>
        </div>
      </section>

      {/* ── Filters & Search ─────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  activeFilter === tab
                    ? "bg-indigo-600 text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:border-indigo-600/40 hover:text-indigo-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
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

      {/* ── Team Sections ────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
        <TeamSection title="Leadership Team" members={leadershipTeam} onMemberClick={handleMemberClick} />
        <TeamSection title="Development Team" members={developmentTeam} onMemberClick={handleMemberClick} />
      </section>

      {/* ── Join CTA ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/80 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
              <Users className="h-5 w-5 text-indigo-600" />
            </span>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Want to join our genius team?
              </h3>
              <p className="text-xs text-gray-500 max-w-sm">
                We&apos;re always on the lookout for talented people who are passionate about what
                they do. Explore our open positions and find your next challenge.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              View Open Positions
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-gray-300 px-5 py-2 text-xs font-semibold text-gray-700 transition hover:border-indigo-600/40"
            >
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

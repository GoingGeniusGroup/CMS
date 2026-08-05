"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getPublicTeamMembers } from "@/app/actions/team";
import TeamMemberModal from "@/components/TeamMemberModal";
import { getTeamPortraitLayoutId } from "@/components/TeamRoster";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
import { MotionCard } from "@/components/motion/MotionCard";
import { SECTION_REGISTRY, type SectionHeaderData } from "@/lib/content/schemas";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";

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

const NAMESPACE = "landing";

export function LandingTeamSection({
  initialMembers,
  headerData,
}: {
  initialMembers?: TeamMember[];
  /** From the "shared.team" section — also shown on /company and /contact. */
  headerData?: SectionHeaderData;
}) {
  const moduleHidden = useModuleDisabled("team");
  const [members, setMembers] = useState<TeamMember[]>(initialMembers ?? []);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const header = headerData ?? SECTION_REGISTRY["shared.team"].defaultData;

  useEffect(() => {
    if (!initialMembers) {
      getPublicTeamMembers().then((data) => setMembers(data));
    }
  }, [initialMembers]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  if (moduleHidden || members.length === 0) return null;

  return (
    <section id="company" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-10">
          <div className="text-center">
            {header.eyebrow && (
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                {header.eyebrow}
              </p>
            )}
            <h2 className="mt-2 text-2xl font-extrabold text-zinc-900">{header.heading}</h2>
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
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
        </RevealOnScroll>

        <StaggerGrid
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          stagger={0.06}
        >
          {members.map((member) => (
            <StaggerItem key={member.id} className="min-w-[200px] max-w-[200px] flex-shrink-0">
              <MotionCard className="h-full rounded-2xl" onClick={() => handleMemberClick(member)}>
                <div className="cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                  <motion.div
                    layoutId={getTeamPortraitLayoutId(NAMESPACE, member.id)}
                    className="relative aspect-square w-full bg-zinc-50"
                  >
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
                  </motion.div>
                  <div className="p-4 text-center">
                    <p className="text-sm font-bold text-zinc-900">{member.fullName}</p>
                    <p className="text-xs text-zinc-500">
                      {member.role || member.department || "Team Member"}
                    </p>
                  </div>
                </div>
              </MotionCard>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>

      {/* Team Member Modal */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        portraitLayoutId={
          selectedMember ? getTeamPortraitLayoutId(NAMESPACE, selectedMember.id) : undefined
        }
      />
    </section>
  );
}

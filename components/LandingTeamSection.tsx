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
import {
  SECTION_REGISTRY,
  type SectionHeaderData,
} from "@/lib/content/schemas";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";
import {
  FaFacebookF,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa6";

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

    const scrollAmount = scrollRef.current.clientWidth * 1.12;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
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
    <section id="company" className="bg-white h-fit px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll className="mb-10">
          <div className="text-center">
            {header.eyebrow && (
              <p className="font-bold uppercase tracking-widest text-indigo-600">
                {header.eyebrow}
              </p>
            )}
            <h2 className=" text-2xl font-semibold text-zinc-900">
              {header.heading}
            </h2>
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
          className="flex gap-10 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          stagger={0.06}
        >
          {members.map((member) => (
            <StaggerItem
              key={member.id}
              className="min-w-50 max-md:w-full min-h-50 shrink-0"
            >
              <MotionCard
                className="h-full w-full rounded-2xl"
                onClick={() => handleMemberClick(member)}
              >
                <div className="cursor-pointer h-fit w-64 max-md:w-full bg-white shadow-sm">
                  <motion.div
                    layoutId={getTeamPortraitLayoutId(NAMESPACE, member.id)}
                    className="relative h-42 w-42 rounded-full overflow-hidden bg-zinc-50"
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
                  <div className=" py-5">
                    <p className="text-xl font-semibold text-zinc-200">
                      {member.fullName}
                    </p>
                    <p className="text-md text-[#F1C50E] uppercase">
                      {member.role || member.department || "Team Member"}
                    </p>
                    <p className="italic mt-1 text-sm text-zinc-300">
                      {member.bio?.split(" ").slice(0, 20).join(" ") +
                        ((member.bio?.split(" ").length ?? 0) > 20 ? "..." : "")}
                    </p>

                    {/* Social / Web Links */}
                    <div className="socialCards">
                      {(member.facebook ||
                        member.twitter ||
                        member.instagram ||
                        member.linkedin ||
                        member.website) && (
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {member.facebook && (
                            <a
                              href={
                                member.facebook.startsWith("http")
                                  ? member.facebook
                                  : `https://${member.facebook}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:text-blue-600 hover:shadow-md hover:z-10"
                              title="Facebook"
                            >
                              <FaFacebookF size={14} />
                            </a>
                          )}
                          {member.twitter && (
                            <a
                              href={
                                member.twitter.startsWith("http")
                                  ? member.twitter
                                  : `https://${member.twitter}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-sky-300 hover:text-sky-500 hover:shadow-md hover:z-10"
                              title="Twitter / X"
                            >
                              <FaTwitter size={14} />
                            </a>
                          )}
                          {member.instagram && (
                            <a
                              href={
                                member.instagram.startsWith("http")
                                  ? member.instagram
                                  : `https://${member.instagram}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-pink-300 hover:text-pink-500 hover:shadow-md hover:z-10"
                              title="Instagram"
                            >
                              <FaInstagram size={14} />
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={
                                member.linkedin.startsWith("http")
                                  ? member.linkedin
                                  : `https://${member.linkedin}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#0A66C2]/40 hover:text-[#0A66C2] hover:shadow-md hover:z-10"
                              title="LinkedIn"
                            >
                              <FaLinkedinIn size={14} />
                            </a>
                          )}
                          {member.website && (
                            <a
                              href={
                                member.website.startsWith("http")
                                  ? member.website
                                  : `https://${member.website}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 hover:text-violet-600 hover:shadow-md hover:z-10"
                              title="Website"
                            >
                              <FaGlobe size={14} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
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
          selectedMember
            ? getTeamPortraitLayoutId(NAMESPACE, selectedMember.id)
            : undefined
        }
      />
    </section>
  );
}

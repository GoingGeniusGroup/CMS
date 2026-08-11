"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Users } from "lucide-react";
import { getPublicTeamMembers, getDepartments } from "@/app/actions/team";
import { getSection, type SiteContentSection } from "@/app/actions/site-content";
import { SECTION_REGISTRY } from "@/lib/content/schemas";
import TeamMemberModal from "@/components/TeamMemberModal";
import { TeamRoster, getTeamPortraitLayoutId, type RosterMember } from "@/components/TeamRoster";
import { RevealOnScroll } from "@/components/motion/RevealOnScroll";
import { PageHero } from "@/components/content/PageHero";
import { usePublicLabel } from "@/components/content/PublicLabelProvider";
import { useModuleDisabled } from "@/components/content/PublicModuleVisibilityProvider";
import { ModuleDisabledPage } from "@/components/content/ModuleDisabledPage";
import { CtaSection } from "@/components/content/CtaSection";

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

const NAMESPACE = "teams-page";
const UNASSIGNED_GROUP = "Other";

/* ─── Page ───────────────────────────────────────────────── */
export default function TeamsPage() {
  const moduleHidden = useModuleDisabled("team");
  // DEFAULT_ENTITY_LABELS["team"].singular is "Team" (plural: "Team Members"),
  // so the search placeholder is built from the singular label rather than
  // just interpolating the raw entity label directly.
  const teamSingular = usePublicLabel("team", { fallback: "Team" });
  const [allMembers, setAllMembers] = useState<TeamMember[]>([]);
  const [departmentOrder, setDepartmentOrder] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroSection, setHeroSection] = useState<SiteContentSection<"teams.hero">>({
    sectionKey: "teams.hero",
    pageKey: "teams",
    variant: "default",
    isVisible: true,
    order: SECTION_REGISTRY["teams.hero"].defaultOrder,
    data: SECTION_REGISTRY["teams.hero"].defaultData,
  });
  const [ctaSection, setCtaSection] = useState<SiteContentSection<"teams.cta">>({
    sectionKey: "teams.cta",
    pageKey: "teams",
    variant: "default",
    isVisible: true,
    order: SECTION_REGISTRY["teams.cta"].defaultOrder,
    data: SECTION_REGISTRY["teams.cta"].defaultData,
  });

  useEffect(() => {
    getPublicTeamMembers().then((data) => setAllMembers(data as TeamMember[]));
    getDepartments().then((depts) => setDepartmentOrder(depts.map((d) => d.name)));
    getSection("teams", "teams.hero").then((section) => setHeroSection(section));
    getSection("teams", "teams.cta").then((section) => setCtaSection(section));
  }, []);

  function handleSelect(member: RosterMember) {
    const full = allMembers.find((m) => m.id === member.id);
    if (!full) return;
    setSelectedMember(full);
    setIsModalOpen(true);
  }

  // Filter by search
  const filtered = searchQuery.trim()
    ? allMembers.filter(
        (m) =>
          m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.role && m.role.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allMembers;

  // Group members by configured Department; anything with no match (a member
  // whose department was renamed/removed, or left blank) falls into "Other".
  // Empty departments are simply never rendered, since we only iterate groups
  // that end up with members.
  const grouped = useMemo(() => {
    const byDept = new Map<string, TeamMember[]>();
    for (const member of filtered) {
      const key =
        member.department && departmentOrder.includes(member.department)
          ? member.department
          : UNASSIGNED_GROUP;
      const list = byDept.get(key) ?? [];
      list.push(member);
      byDept.set(key, list);
    }
    const orderedKeys = [...departmentOrder, UNASSIGNED_GROUP].filter((key) => byDept.has(key));
    return orderedKeys.map((key) => ({ label: key, members: byDept.get(key)! }));
  }, [filtered, departmentOrder]);

  if (moduleHidden) return <ModuleDisabledPage moduleLabel="Team" />;

  return (
    <div className="min-h-screen bg-white">
      <PageHero data={heroSection.data} />

      {/* ── Search ──────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${teamSingular.toLowerCase()} member...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full border border-gray-300 bg-white py-1.5 pl-8 pr-4 text-xs text-gray-700 placeholder:text-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 w-48"
            />
          </div>
        </div>
      </section>

      {/* ── Team Roster, grouped by department ────────────── */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-14 sm:px-6 lg:px-8">
        {grouped.map((group) => (
          <RevealOnScroll key={group.label} className="mb-12">
            <TeamRoster
              members={group.members}
              onSelect={handleSelect}
              groupLabel={group.label}
              namespace={`${NAMESPACE}-${group.label}`}
            />
          </RevealOnScroll>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">No team members found.</p>
          </div>
        )}
      </section>

      {/* ── Join CTA ─────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6 lg:px-8">
        <CtaSection data={ctaSection.data} />
      </section>

      {/* ── Team Member Modal ────────────────────────────── */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMember(null);
        }}
        portraitLayoutId={
          selectedMember
            ? getTeamPortraitLayoutId(
                `${NAMESPACE}-${
                  selectedMember.department && departmentOrder.includes(selectedMember.department)
                    ? selectedMember.department
                    : UNASSIGNED_GROUP
                }`,
                selectedMember.id
              )
            : undefined
        }
      />
    </div>
  );
}

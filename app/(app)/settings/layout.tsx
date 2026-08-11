import { SettingsNav } from "@/components/SettingsNav";
import { Topbar } from "@/components/Topbar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      <SettingsNav />
      <div className="min-w-0 flex-1 space-y-5">
        <Topbar showSearch={false} />
        {children}
      </div>
    </div>
  );
}

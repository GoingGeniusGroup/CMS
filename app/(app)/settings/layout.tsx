import { SettingsNav } from "@/components/SettingsNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6">
      <SettingsNav />
      <div className="flex-1">{children}</div>
    </div>
  );
}

import { Sidebar } from "@/components/Sidebar";
import { ConditionalTopbar } from "@/components/ConditionalTopbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <ConditionalTopbar />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

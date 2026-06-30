import { SearchBar } from "@/components/SearchBar";
import { TopbarActions } from "@/components/TopbarActions";

/**
 * Top navigation bar. Import and render it at the top of any page.
 *
 * - `<Topbar />`                    → search bar + icons + logo
 * - `<Topbar showSearch={false} />` → only icons + logo
 */
export function Topbar({ showSearch = true }: { showSearch?: boolean }) {
  return (
    <header
      className={`mb-6 flex w-full items-center ${
        showSearch ? "justify-between gap-6" : "justify-end gap-12"
      }`}
    >
      {showSearch ? (
        <SearchBar className="h-14 w-full min-w-0 max-w-[866px] flex-1" />
      ) : null}

      <TopbarActions />
    </header>
  );
}

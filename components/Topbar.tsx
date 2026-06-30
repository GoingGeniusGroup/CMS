import { SearchBar } from "@/components/SearchBar";
import { TopbarActions } from "@/components/TopbarActions";

/**
 * Top navigation bar.
 *
 * - `<Topbar />`                  → search bar + icons + logo
 * - `<Topbar showSearch={false} />` → only icons + logo
 */
export function Topbar({ showSearch = true }: { showSearch?: boolean }) {
  return (
    <header
      className={`mx-auto flex w-full max-w-[1490px] items-center px-6 pb-2 pt-6 ${
        showSearch ? "justify-between gap-6" : "justify-end gap-32"
      }`}
    >
      {showSearch ? (
        <SearchBar className="-ml-9 h-14 w-full min-w-0 max-w-[866px] flex-1" />
      ) : null}

      <TopbarActions />
    </header>
  );
}

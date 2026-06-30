import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Remove inner padding (useful for tables/lists that manage their own spacing). */
  noPadding?: boolean;
};

/**
 * Shared card surface. Matches the dashboard card style:
 * white background, rounded-2xl corners, soft box shadow, consistent
 * responsive padding. Use across the whole project for visual consistency.
 */
export function Card({ noPadding = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
        !noPadding && "p-4 sm:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

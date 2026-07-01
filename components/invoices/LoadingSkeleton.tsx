export function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: 8 }).map((_, j) => (
            <td key={j} className="px-4 py-4">
              <div className="h-4 rounded bg-zinc-100" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-1">
      <h1 className="text-2xl font-semibold tracking-tight text-black">
        {title}
      </h1>
      {description ? <p className="text-sm text-black">{description}</p> : null}
    </div>
  );
}
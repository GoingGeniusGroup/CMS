export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-[#f5f3f3] px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Going <span className="text-[#f0b90b]">Genius</span>
        </h1>
        <p className="mt-1 text-sm text-gray-500">Content Management System</p>
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

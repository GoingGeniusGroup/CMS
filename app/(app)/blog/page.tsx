import { PageHeader } from "@/components/PageHeader";
import { Filter, Plus } from "lucide-react";

const stats = [
  { label: "Total Blogs", value: 18, icon: Filter },
  { label: "Published", value: 15, icon: Filter },
  { label: "Draft ", value: 3, icon: Filter },
  
];

export default function BlogPage() {
  return (
    <>

       <div className="flex items-center justify-between px-9 py-15 ">
      {/* Left: Title + Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-black-900 leading-tight">Blog</h1>
        <p className="text-sm text-gray-400 mt-0.5">Manage all your services</p>
      </div>
 
      {/* Right: Filter + Add Blog buttons */}
      <div className="flex items-center gap-3">
        {/* Filter Button */}
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter size={16} strokeWidth={1.8} />
          Filter
        </button>
 
        {/* Add Blog Button */}
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
          Add Blog
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
    {/* Stat cards */}
     <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-8 shadow-[0_6px_24px_rgba(0,0,0,0.25)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
              <Icon className="h-7 w-7" strokeWidth={1.5} />
            </span>
            <div>
              <div className="text-2xl font-semibold tracking-tight">{value}</div>
              <div className="text-sm text-zinc-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

    </>
  );
}

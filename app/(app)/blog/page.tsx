import { PageHeader } from "@/components/PageHeader";
import { Filter, Plus } from "lucide-react";

export default function BlogPage() {
  return (
    <>
       <div className="flex items-center justify-between px-6 py-4">
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
    </>
  );
}

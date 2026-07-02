"use client";

import { useState, useTransition } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { BlogModal } from "@/components/BlogModal";
import { Filter, Plus, Search, Newspaper, Folder } from "lucide-react";
import { getBlogs, deleteBlog } from "@/app/actions/blogs";

type Author = {
  id: string;
  fullName: string;
};

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  category: string | null;
  authorId: string | null;
  author: Author | null;
  status: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type BlogsData = {
  blogs: Blog[];
  total: number;
  published: number;
  drafts: number;
  page: number;
  pageSize: number;
  pageCount: number;
};

const PAGE_SIZE = 10;

export function BlogsClient({
  initialData,
  authors,
}: {
  initialData: BlogsData;
  authors: Author[];
}) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  function refresh(page = currentPage) {
    startTransition(async () => {
      const freshData = await getBlogs(page, PAGE_SIZE);
      setData(freshData as BlogsData);
    });
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    refresh(page);
  }

  function handleAdd() {
    setEditingBlog(null);
    setModalOpen(true);
  }

  function handleEdit(blog: Blog) {
    setEditingBlog(blog);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const result = await deleteBlog(id);
    if (result.success) {
      refresh();
    }
  }

  // Client-side search filter
  const filtered = search.trim()
    ? data.blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.slug.toLowerCase().includes(search.toLowerCase()) ||
          (b.category && b.category.toLowerCase().includes(search.toLowerCase()))
      )
    : data.blogs;

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar/>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title="Blog" description="Manage all your blogs." />
        <div className="flex items-center gap-3">
          <Button variant="secondary">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button onClick={handleAdd}>
            Add Blog
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <StatCard icon={Newspaper} label="Total Blogs" value={data.total} />
        <StatCard icon={Newspaper} label="Published" value={data.published} />
        <StatCard icon={Newspaper} label="Draft" value={data.drafts} />
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">Blogs</h2>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="search"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
          />
        </div>
      </div>

      {/* Blogs Table/Cards */}
      <Card noPadding className="overflow-hidden">
        {isPending ? (
          <div className="flex items-center justify-center p-12 text-sm text-zinc-500">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Folder className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search ? "No blogs match your search" : "No blogs yet. Add your first blog!"}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-zinc-500">
                    <th className="px-6 py-4 font-medium">#</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Slug</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Author</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((blog, index) => (
                    <tr key={blog.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-zinc-600">
                        {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{blog.title}</td>
                      <td className="px-6 py-4 text-zinc-600">{blog.slug}</td>
                      <td className="px-6 py-4 text-zinc-600">{blog.category || "—"}</td>
                      <td className="px-6 py-4 text-zinc-600">{blog.author?.fullName || "—"}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center justify-center min-w-[90px] px-3 py-1 rounded-full text-xs font-medium ${
                            blog.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <RowActions
                          onEdit={() => handleEdit(blog)}
                          onDelete={() => handleDelete(blog.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden divide-y divide-gray-100">
              {filtered.map((blog, index) => (
                <div key={blog.id} className="p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="text-xs sm:text-sm text-gray-500 font-medium w-8">
                      {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-1">
                        {blog.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{blog.slug}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        {blog.category && (
                          <span className="text-xs text-gray-500">{blog.category}</span>
                        )}
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            blog.status === "Published"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <RowActions
                    variant="buttons"
                    onEdit={() => handleEdit(blog)}
                    onDelete={() => handleDelete(blog.id)}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Pagination */}
      {data.pageCount > 1 && (
        <Pagination
          page={currentPage}
          pageCount={data.pageCount}
          rangeLabel={`Showing ${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(currentPage * PAGE_SIZE, data.total)} of ${data.total} entries`}
          onPageChange={handlePageChange}
        />
      )}

      {/* Blog Modal */}
      <BlogModal
        key={editingBlog?.id ?? "new"}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => refresh()}
        blog={editingBlog}
        authors={authors}
      />
    </div>
  );
}

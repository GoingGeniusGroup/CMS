"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { StatCard } from "@/components/StatCard";
import { RowActions } from "@/components/RowActions";
import { Pagination } from "@/components/Pagination";
import { BlogModal } from "@/components/BlogModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { ViewDetailModal } from "@/components/ViewDetailModal";
import { StatusBadge } from "@/components/StatusBadge";
import { useEntityLabel, useStatusOptions } from "@/components/ConfigProvider";
import { Filter, Plus, Search, Newspaper, Folder, List, LayoutGrid } from "lucide-react";
import { getBlogs, deleteBlog } from "@/app/actions/blogs";

type Author = {
  id: string;
  fullName: string;
};

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: unknown;
  excerpt: string | null;
  category: string | null;
  tags: string[];
  readTime: string | null;
  thumbnail: string | null;
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

type CategoryOption = { id: string; name: string };

export function BlogsClient({
  initialData,
  authors,
  categories = [],
}: {
  initialData: BlogsData;
  authors: Author[];
  categories?: CategoryOption[];
}) {
  const [data, setData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(initialData.page);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const filterRef = useRef<HTMLDivElement>(null);

  const blogLabel = useEntityLabel("blog");
  const blogLabelPlural = useEntityLabel("blog", { plural: true });
  const blogStatusOptions = useStatusOptions("blog");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewItem, setViewItem] = useState<Blog | null>(null);

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
    setDeleteId(id);
  }

  async function handleDeleteConfirm() {
    if (!deleteId) return;
    // Optimistic: remove from UI immediately
    setData((prev) => ({
      ...prev,
      blogs: prev.blogs.filter((b) => b.id !== deleteId),
      total: prev.total - 1,
    }));
    const result = await deleteBlog(deleteId);
    setDeleteId(null);
    if (!result.success) {
      refresh();
    }
  }

  const blogCategories = [...new Set(data.blogs.map((b) => b.category).filter(Boolean))] as string[];
  const blogAuthors = [...new Set(data.blogs.map((b) => b.author?.fullName).filter(Boolean))] as string[];

  const filtered = data.blogs.filter((b) => {
    const matchesSearch = !search.trim() ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase()) ||
      (b.category && b.category.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || b.category === categoryFilter;
    const matchesAuthor = authorFilter === "all" || b.author?.fullName === authorFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesAuthor;
  });

  return (
    <div className="space-y-5 sm:space-y-6">
      <Topbar showSearch={false} />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <PageHeader title={blogLabel} description={`Manage all your ${blogLabelPlural.toLowerCase()}.`} />
        <div className="flex items-center gap-3">
          <div className="relative" ref={filterRef}>
            <Button variant="secondary" onClick={() => setFilterOpen((v) => !v)}>
              <Filter className="h-4 w-4" />
              Filter{(statusFilter !== "all" || categoryFilter !== "all" || authorFilter !== "all") ? " (1)" : ""}
            </Button>
            {filterOpen && (
              <div className="absolute max-md:left-0 max-md:right-auto md:right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                {["all", ...blogStatusOptions.map((o) => o.statusValue)].map((s) => (
                  <button key={s} type="button" onClick={() => { setStatusFilter(s); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${statusFilter === s ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>
                    {s === "all" ? "All Statuses" : (blogStatusOptions.find((o) => o.statusValue === s)?.label ?? s)}
                  </button>
                ))}
                <div className="my-2 border-t border-gray-100" />
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</p>
                <button type="button" onClick={() => { setCategoryFilter("all"); setFilterOpen(false); }}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${categoryFilter === "all" ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>
                  All Categories
                </button>
                {blogCategories.map((c) => (
                  <button key={c} type="button" onClick={() => { setCategoryFilter(c); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${categoryFilter === c ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>
                    {c}
                  </button>
                ))}
                <div className="my-2 border-t border-gray-100" />
                <p className="px-4 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Author</p>
                <button type="button" onClick={() => { setAuthorFilter("all"); setFilterOpen(false); }}
                  className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${authorFilter === "all" ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>
                  All Authors
                </button>
                {blogAuthors.map((a) => (
                  <button key={a} type="button" onClick={() => { setAuthorFilter(a); setFilterOpen(false); }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 ${authorFilter === a ? "bg-zinc-100 font-semibold text-zinc-900" : "text-zinc-600"}`}>
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button onClick={handleAdd}>
            Add {blogLabel}
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        <StatCard icon={Newspaper} label={`Total ${blogLabelPlural}`} value={data.total} />
        <StatCard icon={Newspaper} label="Published" value={data.published} />
        <StatCard icon={Newspaper} label="Draft" value={data.drafts} />
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-black">{blogLabelPlural}</h2>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="List view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                viewMode === "card"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              title="Card view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              placeholder={`Search ${blogLabelPlural.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-700 shadow-sm outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 && !isPending ? (
        <Card noPadding className="overflow-hidden">
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <Folder className="h-10 w-10 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              {search ? `No ${blogLabelPlural.toLowerCase()} match your search` : `No ${blogLabelPlural.toLowerCase()} yet. Add your first ${blogLabel.toLowerCase()}!`}
            </p>
          </div>
        </Card>
      ) : viewMode === "list" ? (
        /* ─── List View (Table) ─── */
        <Card noPadding className="overflow-hidden">
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 w-16">#</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700 w-20">Thumbnail</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Title</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Slug</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Category</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Author</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((blog, index) => (
                  <tr key={blog.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-600">
                      {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                    </td>
                    <td className="p-4">
                      <div className="h-10 w-10 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200">
                        {blog.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={blog.thumbnail} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">{blog.title}</td>
                    <td className="p-4 text-sm text-gray-600">{blog.slug}</td>
                    <td className="p-4 text-sm text-gray-600">{blog.category || "—"}</td>
                    <td className="p-4 text-sm text-gray-600">{blog.author?.fullName || "—"}</td>
                    <td className="p-4">
                      <StatusBadge moduleKey="blog" value={blog.status} />
                    </td>
                    <td className="p-4">
                      <RowActions onView={() => setViewItem(blog)} onEdit={() => handleEdit(blog)} onDelete={() => handleDelete(blog.id)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile fallback */}
          <div className="sm:hidden divide-y divide-gray-100">
            {filtered.map((blog, index) => (
              <div key={blog.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-xs text-gray-500 font-medium w-6">
                    {String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                  </div>
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-zinc-100 border border-zinc-200">
                    {blog.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={blog.thumbnail} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{blog.title}</h3>
                    <p className="text-xs text-gray-600 mb-2 truncate">{blog.slug}</p>
                    <StatusBadge moduleKey="blog" value={blog.status} />
                  </div>
                </div>
                <RowActions variant="buttons" onView={() => setViewItem(blog)} onEdit={() => handleEdit(blog)} onDelete={() => handleDelete(blog.id)} />
              </div>
            ))}
          </div>
        </Card>
      ) : (
        /* ─── Card View (Grid) ─── */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((blog) => (
            <div
              key={blog.id}
              className="group rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="aspect-[3/2] w-full relative bg-zinc-50 border-b border-zinc-100 overflow-hidden">
                {blog.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600" />
                )}
              </div>

              <div className="p-5">
                {/* Title & Status */}
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{blog.title}</h3>
                  <StatusBadge moduleKey="blog" value={blog.status} className="shrink-0 px-3 py-1 text-[11px]" />
                </div>

                {/* Slug */}
                <p className="mb-3 text-xs text-gray-400 truncate">{blog.slug}</p>

                {/* Meta */}
                <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  {blog.category && (
                    <span>Category: <span className="text-gray-700">{blog.category}</span></span>
                  )}
                  {blog.author && (
                    <span>Author: <span className="text-gray-700">{blog.author.fullName}</span></span>
                  )}
                </div>

                {/* Actions */}
                <RowActions variant="buttons" onView={() => setViewItem(blog)} onEdit={() => handleEdit(blog)} onDelete={() => handleDelete(blog.id)} />
              </div>
            </div>
          ))}
        </div>
      )}

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
        onSuccess={() => { setModalOpen(false); refresh(); }}
        blog={editingBlog}
        authors={authors}
        categories={categories}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={!!deleteId}
        title={`Delete ${blogLabel}`}
        description={`Are you sure you want to delete this ${blogLabel.toLowerCase()}? This action cannot be undone.`}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* View Detail Modal */}
      <ViewDetailModal
        open={!!viewItem}
        onClose={() => setViewItem(null)}
        title={viewItem?.title || ""}
        imageUrl={viewItem?.thumbnail || undefined}
        fields={[
          { label: "Title", value: viewItem?.title },
          { label: "Slug", value: viewItem?.slug },
          { label: "Category", value: viewItem?.category },
          { label: "Author", value: viewItem?.author?.fullName },
          { label: "Status", value: viewItem?.status },
          { label: "Excerpt", value: viewItem?.excerpt },
          { label: "Tags", value: viewItem?.tags?.join(", ") },
          { label: "Read Time", value: viewItem?.readTime },
        ]}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { images } from "@/lib/images";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Products", href: "#products" },
  { label: "Company", href: "#company" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const servicesMega = {
  columns: [
    {
      title: "Development",
      items: ["Web Development", "Software Development", "App Development"],
    },
    {
      title: "Design",
      items: ["UI/UX Design", "Graphic Design", "Brand Identity"],
    },
    {
      title: "Marketing",
      items: ["SEO Optimization", "Social Media Marketing", "Content Marketing"],
    },
  ],
  featured: {
    title: "Marketing",
    desc: "Data-driven campaigns that turn attention into measurable growth for your business.",
  },
};

export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/home" className="flex items-center gap-2">
          <Image
            src={images.logo1}
            alt="Going Genius"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
          <span className="text-sm font-bold text-zinc-900">Going Genius</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) =>
            item.label === "Services" ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  {item.label}
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`} />
                </a>

                {/* Mega Dropdown */}
                <div className={`absolute left-1/2 top-full pt-4 -translate-x-1/2 transition-all duration-200 ease-out ${servicesOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}>
                  <div className="w-[680px] rounded-xl border border-zinc-100 bg-white p-5 shadow-2xl shadow-zinc-200/60">
                    <div className="grid grid-cols-4 gap-5">
                      {/* Service Columns */}
                      {servicesMega.columns.map((col) => (
                        <div key={col.title}>
                          <h4 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-purple-600">
                            {col.title}
                          </h4>
                          <ul className="space-y-1.5">
                            {col.items.map((subItem) => (
                              <li key={subItem}>
                                <a
                                  href="#services"
                                  className="block rounded-md px-2 py-1.5 text-[13px] text-zinc-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
                                >
                                  {subItem}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Featured Card */}
                      <div className="rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
                        <h4 className="text-sm font-bold text-purple-700">
                          {servicesMega.featured.title}
                        </h4>
                        <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">
                          {servicesMega.featured.desc}
                        </p>
                        <Image
                          src={images.web}
                          alt="Services"
                          width={180}
                          height={90}
                          className="mt-3 h-20 w-full rounded-lg object-cover"
                        />
                        <a
                          href="#services"
                          className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-800"
                        >
                          Explore Services →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Admin Login
          </Link>
          <a
            href="#contact"
            className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="ml-3 inline-flex items-center rounded-md p-2 text-zinc-600 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-100 bg-white/95">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="space-y-3">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/login"
                className="block rounded-md px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-50"
                onClick={() => setMobileOpen(false)}
              >
                Admin Login
              </Link>
              <a
                href="#contact"
                className="mt-2 inline-block w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-center text-sm font-semibold text-white shadow-sm"
                onClick={() => setMobileOpen(false)}
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

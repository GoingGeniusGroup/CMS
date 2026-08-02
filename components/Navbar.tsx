"use client";

import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services", dropdown: true },
    { label: "Portfolio", href: "#portfolio"},
    { label: "Products", href: "#products"},
    { label: "Company", href: "#company" },
    { label: "Blog", href: "#blog"},
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="w-full py-6 px-4">
      <div className="mx-auto max-w-7xl rounded-md border border-gray-300 bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <Link href="/Logo2.png" className="flex items-center gap-2">
            {/* Replace with your logo */}
            {/* <Image src="/logo.png" alt="Logo" width={40} height={40} /> */}

            <span className="text-xl font-bold">Logo</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1 font-semibold text-gray-900 hover:text-violet-600 transition"
              >
                {item.label}

                {item.dropdown && (
                  <ChevronDown size={16} strokeWidth={2.5} />
                )}
              </Link>
            ))}
          </nav>

          {/* Button */}
          <div className="hidden lg:block">
            <Link
              href="#contact"
              className="rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-7 py-3 text-white font-medium hover:opacity-90"
            >
              Get in Touch
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="border-t lg:hidden">
            <div className="flex flex-col p-5 space-y-4">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-medium text-gray-700"
                >
                  {item.label}
                </Link>
              ))}

              <Link
                href="#contact"
                className="mt-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 py-3 text-center text-white"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
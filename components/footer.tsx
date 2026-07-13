import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

type FooterProps = {
  logoUrl?: string;
  siteName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
};

function Footer({ logoUrl, siteName, contactEmail, contactPhone, contactAddress }: FooterProps) {
  const columns = [
    {
      title: "Platform",
      links: [
        { label: "Portals", href: "#home" },
        { label: "Relativity", href: "#services" },
        { label: "Software Development", href: "#services" },
        { label: "5G", href: "#services" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "User Guide", href: "#" },
        { label: "FAQs", href: "#faq" },
        { label: "Developers", href: "#" },
        { label: "Sitemap", href: "#" },
        { label: "Support", href: "/contact" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "About", href: "#company" },
        { label: "Services", href: "/our-services" },
        { label: "Career", href: "#" },
        { label: "Contact Us", href: "/contact" },
        { label: "Blog", href: "#blog" },
      ],
    },
  ];

  return (
    <footer id="contact" className="bg-[#111a33] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-[220px] flex-1">
            <div className="flex items-center gap-3">
              <Image
                src={logoUrl || "/logo.png"}
                alt={siteName || "Going Genius"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-contain"
              />
              <div>
                <p className="text-2xl font-bold text-white">
                  Going <span className="text-yellow-400">Genius</span>
                </p>
                <p className="text-base font-medium">
                  <span className="text-white">Group of</span>{" "}
                  <span className="text-yellow-400">Companies</span>
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Going Genius provides services that add value to your ideas.
              Connect with us today and transform your vision into reality.
            </p>
            <div className="mt-4 max-w-[180px] rounded-2xl overflow-hidden bg-white/5">
              <Image
                src="/Component49.png"
                alt="Footer visual"
                width={180}
                height={90}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="min-w-[160px] flex-1">
              <p className="text-sm font-bold text-white">{col.title}</p>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-400 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="min-w-[220px] flex-1">
            <p className="text-sm font-bold text-white">Contact Us</p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-zinc-400">
                <Mail className="h-4 w-4 shrink-0" />{" "}
                {contactEmail || "goinggenius2021@gmail.com"}
              </li>
              <li className="flex items-center gap-2 text-sm text-zinc-400">
                <Phone className="h-4 w-4 shrink-0" />{" "}
                {contactPhone || "976-8527869"}
              </li>
              <li className="flex items-start gap-2 text-sm text-zinc-400">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />{" "}
                {contactAddress || "Milan Chowk Marga, Kathmandu 44600"}
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Going Genius Group of Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

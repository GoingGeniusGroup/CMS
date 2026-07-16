import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube, FaWhatsapp, FaGithub } from "react-icons/fa";

type LinkItem = { label: string; href: string };
type LinkColumn = { title: string; links: LinkItem[] };
type SocialEntry = { platform: string; url: string };

type FooterProps = {
  logoUrl?: string;
  siteName?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  aboutDesc?: string;
  brandText?: string;
  copyrightText?: string;
  linkColumns?: LinkColumn[];
  socials?: SocialEntry[];
  paymentLogoUrl?: string;
  footerLogoUrl?: string;
};

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  Facebook: FaFacebookF,
  Twitter: FaTwitter,
  LinkedIn: FaLinkedinIn,
  Instagram: FaInstagram,
  YouTube: FaYoutube,
  WhatsApp: FaWhatsapp,
  GitHub: FaGithub,
};

function Footer({
  logoUrl,
  siteName,
  contactEmail,
  contactPhone,
  contactAddress,
  aboutDesc,
  brandText,
  copyrightText,
  linkColumns,
  socials,
  paymentLogoUrl,
  footerLogoUrl,
}: FooterProps) {
  const columns: LinkColumn[] = linkColumns && linkColumns.length > 0
    ? linkColumns
    : [
        { title: "Platform", links: [{ label: "Portals", href: "/home" }, { label: "Software Development", href: "/our-services" }] },
        { title: "Resources", links: [{ label: "FAQs", href: "#faq" }, { label: "Support", href: "/contact" }] },
        { title: "About", links: [{ label: "About", href: "/company" }, { label: "Services", href: "/our-services" }, { label: "Contact Us", href: "/contact" }] },
      ];

  const description = aboutDesc || "Going Genius provides services that add value to your ideas. Connect with us today and transform your vision into reality.";
  const copyright = copyrightText || `© ${new Date().getFullYear()} Going Genius Group of Company. All rights reserved.`;

  return (
    <footer id="contact" className="bg-[#111a33] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-6">
          {/* Brand + Description + Socials */}
          <div className="min-w-[220px] flex-1">
            <div className="flex items-center gap-3">
              <Image
                src={footerLogoUrl || logoUrl || "/logo.png"}
                alt={siteName || "Going Genius"}
                width={40}
                height={40}
                className="h-10 w-10 rounded-lg object-contain"
              />
              <div>
                <p className="text-2xl font-bold text-white">
                  {brandText || "Going Genius Group of Companies"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              {description}
            </p>

            {/* Social Icons */}
            {socials && socials.length > 0 && (
              <div className="mt-5 flex items-center gap-3">
                {socials.map((s, i) => {
                  const Icon = SOCIAL_ICONS[s.platform];
                  if (!Icon || !s.url) return null;
                  return (
                    <a
                      key={i}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-zinc-300 transition-colors hover:bg-white/20 hover:text-white"
                      title={s.platform}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title} className="min-w-[160px] flex-1">
              <p className="text-sm font-bold text-white">{col.title}</p>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
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

        {/* Bottom: Copyright + Payment Logo */}
        <div className="mt-10 border-t border-white/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">{copyright}</p>

          {paymentLogoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={paymentLogoUrl}
              alt="Payment methods"
              className="h-10 w-auto max-w-[200px] object-contain sm:h-12 sm:max-w-[260px]"
            />
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;

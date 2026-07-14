import { getPublicPartners } from "@/app/actions/settings";
import { images } from "@/lib/images";
import Image from "next/image";

/**
 * Server component — fetches partner logos from the DB and renders them.
 * Falls back to the static frame2 image if no logos have been saved yet.
 */
export async function PartnersSection() {
  const partners = await getPublicPartners();

  return (
    <section className="bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="mb-6 text-center text-xs font-bold uppercase tracking-widest text-zinc-400">
          Our Partners
        </p>

        {partners.length > 0 ? (
          /* Dynamic logos from the CMS */
          <div className="flex flex-wrap items-center justify-center gap-8">
            {partners.map((url, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={url}
                alt={`Partner ${i + 1}`}
                className="h-10 w-auto max-w-[140px] object-contain opacity-80 brightness-0 invert sm:h-12"
              />
            ))}
          </div>
        ) : (
          /* Static fallback */
          <div className="flex items-center justify-center">
            <Image
              src={images.frame2}
              alt="Our partners"
              width={900}
              height={60}
              className="h-10 w-auto object-contain sm:h-12"
            />
          </div>
        )}
      </div>
    </section>
  );
}

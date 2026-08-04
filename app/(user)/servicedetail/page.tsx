// This route was a static placeholder. The real per-service detail page is
// /servicedetail/[slug] — redirect anyone who lands here to the services listing.
import { redirect } from "next/navigation";

export default function ServiceDetailIndexPage() {
  redirect("/our-services");
}

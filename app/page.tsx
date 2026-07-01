import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to login - middleware will handle auth and redirect to dashboard if logged in
  redirect("/login");
}

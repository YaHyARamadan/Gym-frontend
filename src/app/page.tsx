import { redirect } from "next/navigation";

/** Root page — redirect to login (middleware handles authenticated users) */
export default function RootPage() {
  redirect("/login");
}

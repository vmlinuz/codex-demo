import { redirect } from "next/navigation";

import { getAuthSession } from "@/server/auth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await getAuthSession();

  redirect(session?.user ? "/notes" : "/login");
}

// components/Navbar.tsx (Server Component)
import { getSession } from "@/lib/session";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  // ✅ جلب الـ session على الـ server
  const session = await getSession();

  // ✅ تمرير الـ session للـ Client Component
  return <NavbarClient session={session} />;
}

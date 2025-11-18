import { getSession } from "@/lib/session";
import { NavbarClient } from "./NavbarClient";

export async function Navbar() {
  const session = await getSession();

  return <NavbarClient session={session} />;
}

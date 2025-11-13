import HomeClient from "@/components/layout/home/HomePage";
import { getSession } from "@/lib/session";

export const revalidate = 300;

const HomePage = async () => {
  // هذه دالة server-only — تُقرأ الكوكيز/السِشن بأمان هنا
  const session = await getSession();

  return <HomeClient session={session} />;
};
export default HomePage;

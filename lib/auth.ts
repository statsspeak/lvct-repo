import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export async function checkUserRole(allowedRoles: string[]) {
  const session = await getServerSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  const userRole = (session.user as any).role;
  if (!allowedRoles.includes(userRole)) {
    redirect("/unauthorized");
  }
}

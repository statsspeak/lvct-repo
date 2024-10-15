import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardNav } from "@/components/DashboardNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { NotificationBell } from "@/components/NotificationBell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav userRole={(session.user as any).role} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <Breadcrumbs />
          <NotificationBell />
        </div>
        <div className="bg-white shadow-sm rounded-lg p-6">{children}</div>
      </main>
    </div>
  );
}

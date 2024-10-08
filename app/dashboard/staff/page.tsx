import { Metadata } from "next";
import Unauthorized from "@/app/unauthorized/page";
import { auth } from "@/auth";
import { StaffDashboardContent } from "@/components/StaffDashboardContent";

export const metadata: Metadata = {
  title: "Staff Dashboard | LVCT Health",
  description: "Staff dashboard for managing patients",
};

export default async function StaffDashboard() {
  const session = await auth();
  const userRole = (session?.user as any)?.role || "";

  if (!session || !["STAFF", "ADMIN"].includes(userRole)) {
    return <Unauthorized />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-lvct-purple mb-8">
        Staff Dashboard
      </h1>
      <StaffDashboardContent userRole={userRole} />
    </div>
  );
}

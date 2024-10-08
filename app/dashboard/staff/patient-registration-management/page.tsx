import { Metadata } from "next";
import { auth } from "@/auth";
import { StaffPatientRegistrationManagement } from "@/components/StaffPatientRegistrationManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Unauthorized from "@/app/unauthorized/page";
import PendingSelfRegistrations from "@/components/PendingSelfRegistrations";

export const metadata: Metadata = {
  title: "Patient Registration Management | LVCT Health",
  description:
    "Manage patient registrations and generate QR codes for self-registration",
};

export default async function PatientRegistrationManagementPage() {
  const session = await auth();
  if (!session || !["STAFF", "ADMIN"].includes((session.user as any).role)) {
    return <Unauthorized />;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-lvct-purple">
          Patient Registration Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <StaffPatientRegistrationManagement />
        <PendingSelfRegistrations />
      </CardContent>
    </Card>
  );
}

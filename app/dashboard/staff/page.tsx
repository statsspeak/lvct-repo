import { Metadata } from "next";
import Unauthorized from "@/app/unauthorized/page";
import { auth } from "@/auth";
import { StaffDashboardContent } from "@/components/StaffDashboardContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Staff Dashboard | LVCT Health",
  description: "Staff dashboard for managing patients and tests",
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
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-1/2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <StaffDashboardContent userRole={userRole} />
        </TabsContent>
        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-lvct-purple">
                Patient Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Patient management content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-lvct-purple">
                Test Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Test management content goes here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

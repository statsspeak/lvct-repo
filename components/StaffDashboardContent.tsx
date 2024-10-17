"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { Icons } from "@/components/ui/icons";
import PendingSelfRegistrations from "./PendingSelfRegistrations";
import { StaffPatientRegistrationManagement } from "@/components/StaffPatientRegistrationManagement";

interface SSEData {
  recentPatients: Array<{ id: string; firstName: string; lastName: string }>;
}

export function StaffDashboardContent({ userRole }: { userRole: string }) {
  const [data, setData] = useState<SSEData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(`/api/sse?role=${userRole}`);

    eventSource.onmessage = (event) => {
      try {
        const parsedData = JSON.parse(event.data);
        setData(parsedData);
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      setError("Failed to connect to server");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userRole]);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-lvct-purple">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild className="flex-1 bg-lvct-red hover:bg-lvct-red/90">
            <Link href="/dashboard/staff/register-patient">
              <Icons.userPlus className="mr-2 h-4 w-4" />
              Register New Patient
            </Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-lvct-purple hover:bg-lvct-purple/90"
          >
            <Link href="/dashboard/staff/patient-registration-management">
              <Icons.clipboardList className="mr-2 h-4 w-4" />
              Manage Registrations
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-lvct-purple">
              Recent Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.recentPatients.map((patient) => (
                <li key={patient.id} className="text-sm flex items-center">
                  <Icons.user className="mr-2 h-4 w-4 text-lvct-purple" />
                  {patient.firstName} {patient.lastName}
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="mt-4 w-full bg-lvct-purple hover:bg-lvct-purple/90"
            >
              <Link href="/dashboard/staff/patients">View All Patients</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-lvct-purple">
              Patient Registration Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StaffPatientRegistrationManagement />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-lvct-purple">
            Self-Registrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PendingSelfRegistrations />
        </CardContent>
      </Card>
    </div>
  );
}



import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  PhoneIcon,
  UsersIcon,
  BarChart3Icon,
  CalendarIcon,
} from "lucide-react";

export default function CallCenterAgentDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-lvct-purple">
        Call Center Agent Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Patient Communications
            </CardTitle>
            <PhoneIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Patients</div>
            <p className="text-xs text-muted-foreground">
              View and record patient communications
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href="/dashboard/call-center-agent/communications">
                View Communications
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Follow-ups</div>
            <p className="text-xs text-muted-foreground">
              Track and manage patient follow-ups
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href="/dashboard/call-center-agent/follow-ups">
                Manage Follow-ups
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Communication Stats
            </CardTitle>
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">View Statistics</div>
            <p className="text-xs text-muted-foreground">
              Analyze communication performance
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href="/dashboard/call-center-agent/communications/stats">
                View Stats
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manage Appointments</div>
            <p className="text-xs text-muted-foreground">
              Schedule and view patient appointments
            </p>
            <Button asChild className="mt-4 w-full">
              <Link href="/dashboard/call-center-agent/appointments">
                Manage Appointments
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

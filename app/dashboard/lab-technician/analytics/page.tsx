import { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TestResultsChart } from "@/components/analytics/TestResultsChart";
import { TurnaroundTimeChart } from "@/components/analytics/TurnaroundTimeChart";
import {
  getTestResultsAnalytics,
  getTurnaroundTimeAnalytics,
} from "@/app/actions/analytics";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart, PieChart } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Lab Analytics | Lab Technician Dashboard",
  description: "View and analyze lab test data",
};

async function AnalyticsContent() {
  const [testResults, turnaroundTime] = await Promise.all([
    getTestResultsAnalytics(),
    getTurnaroundTimeAnalytics(),
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2" />
            Test Results Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array.isArray(testResults) ? (
            <TestResultsChart data={testResults} />
          ) : (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{testResults.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="w-5 h-5 mr-2" />
            Test Turnaround Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!("error" in turnaroundTime) ? (
            <TurnaroundTimeChart data={turnaroundTime} />
          ) : (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{turnaroundTime.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default async function LabAnalyticsPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "LAB_TECHNICIAN") {
    redirect("/unauthorized");
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lab Analytics</h1>
        <Link href="/dashboard/lab-technician">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center">
            <Spinner />
          </div>
        }
      >
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}

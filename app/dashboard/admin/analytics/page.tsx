import React, { Suspense } from "react";
import {
  getAnalyticsOverview,
  getTestResultsAnalytics,
  getPatientDemographics,
  getTurnaroundTimeAnalytics,
  getCommunicationEffectivenessMetrics,
} from "@/app/actions/analytics";
import { OverviewMetrics } from "@/components/analytics/OverviewMetrics";
import { TestResultsChart } from "@/components/analytics/TestResultsChart";
import { PatientDemographicsChart } from "@/components/analytics/PatientDemographicsChart";
import { TurnaroundTimeChart } from "@/components/analytics/TurnaroundTimeChart";
import { CommunicationEffectivenessChart } from "@/components/analytics/CommunicationEffectivenessChart";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[200px] w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}

async function AnalyticsContent() {
  try {
    const [
      overviewData,
      testResultsData,
      patientDemographicsData,
      turnaroundTimeData,
      communicationEffectivenessData,
    ] = await Promise.all([
      getAnalyticsOverview(),
      getTestResultsAnalytics(),
      getPatientDemographics(),
      getTurnaroundTimeAnalytics(),
      getCommunicationEffectivenessMetrics(),
    ]);

    const errorChecks = [
      { name: "Overview", data: overviewData },
      { name: "Test Results", data: testResultsData },
      { name: "Patient Demographics", data: patientDemographicsData },
      { name: "Turnaround Time", data: turnaroundTimeData },
      {
        name: "Communication Effectiveness",
        data: communicationEffectivenessData,
      },
    ];

    for (const check of errorChecks) {
      if ("error" in check.data) {
        console.error(`Error in ${check.name} data:`, check.data.error);
        return (
          <div className="text-center text-lvct-red font-bold">
            Error loading {check.name.toLowerCase()} data. Please try again
            later.
          </div>
        );
      }
    }

    return (
      <div className="space-y-6">
        {!("error" in overviewData) && <OverviewMetrics data={overviewData} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow border border-lvct-purple">
            <h2 className="text-xl font-bold mb-4 text-lvct-purple">
              Test Results
            </h2>
            {!("error" in testResultsData) && (
              <TestResultsChart data={testResultsData} />
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-lvct-purple">
            <h2 className="text-xl font-bold mb-4 text-lvct-purple">
              Patient Demographics
            </h2>
            {!("error" in patientDemographicsData) && (
              <PatientDemographicsChart data={patientDemographicsData} />
            )}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-lvct-purple">
          <h2 className="text-xl font-bold mb-4 text-lvct-purple">
            Turnaround Time
          </h2>
          {!("error" in turnaroundTimeData) && (
            <TurnaroundTimeChart data={turnaroundTimeData} />
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow border border-lvct-purple">
          <h2 className="text-xl font-bold mb-4 text-lvct-purple">
            Communication Effectiveness
          </h2>
          {!("error" in communicationEffectivenessData) && (
            <CommunicationEffectivenessChart
              data={communicationEffectivenessData}
            />
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in AnalyticsContent:", error);
    return (
      <div className="text-center text-lvct-red font-bold">
        An unexpected error occurred. Please try again later.
      </div>
    );
  }
}

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-lvct-purple">
        Analytics Dashboard
      </h1>
      <Suspense fallback={<LoadingFallback />}>
        <AnalyticsContent />
      </Suspense>
    </div>
  );
}

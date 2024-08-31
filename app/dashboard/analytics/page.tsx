import React, { Suspense } from 'react';
import { getAnalyticsOverview, getTestResultsAnalytics, getPatientDemographics, getTurnaroundTimeAnalytics, getCommunicationEffectivenessMetrics } from '@/app/actions/analytics';
import { OverviewMetrics } from '@/components/analytics/OverviewMetrics';
import { TestResultsChart } from '@/components/analytics/TestResultsChart';
import { PatientDemographicsChart } from '@/components/analytics/PatientDemographicsChart';
import { TurnaroundTimeChart } from '@/components/analytics/TurnaroundTimeChart';
import { CommunicationEffectivenessChart } from '@/components/analytics/CommunicationEffectivenessChart';
import { auth } from "@/auth";
import { redirect } from "next/navigation";

function LoadingFallback() {
    return <div>Loading...</div>;
}

async function AnalyticsContent() {
    const [
        overviewData,
        testResultsData,
        patientDemographicsData,
        turnaroundTimeData,
        communicationEffectivenessData
    ] = await Promise.all([
        getAnalyticsOverview(),
        getTestResultsAnalytics(),
        getPatientDemographics(),
        getTurnaroundTimeAnalytics(),
        getCommunicationEffectivenessMetrics()
    ]);

    if ('error' in overviewData || 'error' in testResultsData || 'error' in patientDemographicsData ||
        'error' in turnaroundTimeData || 'error' in communicationEffectivenessData) {
        return <div>Error loading analytics data. Please try again later.</div>;
    }

    return (
        <>
            <OverviewMetrics data={overviewData} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <TestResultsChart data={testResultsData} />
                <PatientDemographicsChart data={patientDemographicsData} />
            </div>

            <TurnaroundTimeChart data={turnaroundTimeData} />

            <CommunicationEffectivenessChart data={communicationEffectivenessData} />
        </>
    );
}

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session || !["ADMIN", "STAFF"].includes((session.user as any).role)) {
        redirect('/dashboard');
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <Suspense fallback={<LoadingFallback />}>
                <AnalyticsContent />
            </Suspense>
        </div>
    );
}
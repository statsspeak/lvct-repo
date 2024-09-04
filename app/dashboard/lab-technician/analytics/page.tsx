import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TestResultsChart } from '@/components/analytics/TestResultsChart';
import { TurnaroundTimeChart } from '@/components/analytics/TurnaroundTimeChart';
import { getTestResultsAnalytics, getTurnaroundTimeAnalytics } from '@/app/actions/analytics';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const metadata = {
    title: 'Lab Analytics | Lab Technician Dashboard',
    description: 'View and analyze lab test data',
};

async function AnalyticsContent() {
    const [testResults, turnaroundTime] = await Promise.all([
        getTestResultsAnalytics(),
        getTurnaroundTimeAnalytics(),
    ]);

    return (
        <>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Test Results Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    {Array.isArray(testResults) ? (
                        <TestResultsChart data={testResults} />
                    ) : (
                        <p>Error: {testResults.error}</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Test Turnaround Time</CardTitle>
                </CardHeader>
                <CardContent>
                    {!('error' in turnaroundTime) ? (
                        <TurnaroundTimeChart data={turnaroundTime} />
                    ) : (
                        <p>Error: {turnaroundTime.error}</p>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default async function LabAnalyticsPage() {
    const session = await auth();
    if (!session || (session.user as any).role !== "LAB_TECHNICIAN") {
        redirect('/unauthorized');
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Lab Analytics</h1>
            <Suspense fallback={<LoadingSpinner />}>
                <AnalyticsContent />
            </Suspense>
        </div>
    );
}
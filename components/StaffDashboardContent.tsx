'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import { TestResultsChart } from "@/components/TestResultsChart";

interface SSEData {
    recentPatients: Array<{ id: string; firstName: string; lastName: string }>;
    recentTests: Array<{ id: string; status: string; patientId: string }>;
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
                console.error('Error parsing SSE data:', err);
            }
        };

        eventSource.onerror = (err) => {
            console.error('SSE error:', err);
            setError('Failed to connect to server');
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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Patients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {data.recentPatients.map(patient => (
                                <li key={patient.id} className="text-sm">
                                    {patient.firstName} {patient.lastName}
                                </li>
                            ))}
                        </ul>
                        <Button asChild className="mt-4 w-full">
                            <Link href="/dashboard/staff/patients">View All Patients</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Tests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {data.recentTests.map(test => (
                                <li key={test.id} className="text-sm">
                                    Patient ID: {test.patientId}, Status: {test.status}
                                </li>
                            ))}
                        </ul>
                        <Button asChild className="mt-4 w-full">
                            <Link href="/dashboard/staff/tests">View All Tests</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button asChild className="w-full">
                            <Link href="/dashboard/staff/register-patient">Register New Patient</Link>
                        </Button>
                        {/* <Button asChild className="w-full">
                            <Link href="/dashboard/staff/create-test">Create New Test</Link>
                        </Button> */}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Test Results Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <TestResultsChart />
                </CardContent>
            </Card>
        </div>
    );
}
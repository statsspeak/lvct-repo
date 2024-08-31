import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestStatus } from "@prisma/client";

interface PatientDetailsProps {
    patient: {
        id: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        email: string | null;
        phone: string | null;
        tests: Array<{
            id: string;
            status: TestStatus;
            collectionDate: Date;
            resultDate: Date | null;
        }>;
    };
}

export function PatientDetails({ patient }: PatientDetailsProps) {
    const latestTest = patient.tests[0]; // Assuming tests are ordered by date desc

    return (
        <Card>
            <CardHeader>
                <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-semibold">Name:</p>
                        <p>{`${patient.firstName} ${patient.lastName}`}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Date of Birth:</p>
                        <p>{patient.dateOfBirth.toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Email:</p>
                        <p>{patient.email || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Phone:</p>
                        <p>{patient.phone || 'N/A'}</p>
                    </div>
                    {latestTest && (
                        <>
                            <div>
                                <p className="font-semibold">Latest Test Status:</p>
                                <p>{latestTest.status}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Test Collection Date:</p>
                                <p>{latestTest.collectionDate.toLocaleDateString()}</p>
                            </div>
                            {latestTest.resultDate && (
                                <div>
                                    <p className="font-semibold">Test Result Date:</p>
                                    <p>{latestTest.resultDate.toLocaleDateString()}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
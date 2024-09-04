'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from '@/components/ErrorMessage';
import { Spinner } from '@/components/ui/spinner';
import { CommunicationMethod, CommunicationOutcome } from '@prisma/client';
import { getUpcomingFollowUps } from '@/app/actions/communications';

type FollowUp = {
    id: string;
    patientId: string;
    testId: string;
    method: CommunicationMethod;
    outcome: CommunicationOutcome;
    notes: string | null;
    followUpDate: Date | null;
    communicatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    patient: {
        firstName: string;
        lastName: string;
    };
    test: {
        status: string;
    };
};

export function UpcomingFollowUps() {
    const [followUps, setFollowUps] = useState<FollowUp[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFollowUps = async () => {
            try {
                const result = await getUpcomingFollowUps();
                if ('error' in result) {
                    setError(result.error || 'An unknown error occurred');
                } else {
                    setFollowUps(result.followUps);
                }
            } catch (err) {
                setError('Failed to load upcoming follow-ups');
            }
        };
        fetchFollowUps();
        const intervalId = setInterval(fetchFollowUps, 300000); // Refresh every 5 minutes

        return () => clearInterval(intervalId);
    }, []);

    if (error) return <ErrorMessage message={error} />;
    if (!followUps) return <Spinner />;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Upcoming Follow-ups</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Follow-up Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Test Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {followUps.map((followUp) => (
                        <TableRow key={followUp.id}>
                            <TableCell>{`${followUp.patient.firstName} ${followUp.patient.lastName}`}</TableCell>
                            <TableCell>{followUp.followUpDate ? new Date(followUp.followUpDate).toLocaleString() : 'N/A'}</TableCell>
                            <TableCell>{followUp.method}</TableCell>
                            <TableCell>{followUp.test.status}</TableCell>
                            <TableCell>
                                <Button variant="outline" onClick={() => handleContact(followUp)}>
                                    Contact
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function handleContact(followUp: FollowUp) {
    // Implement the contact action here
    console.log('Contacting patient:', followUp.patientId);
}
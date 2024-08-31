'use client';

import React, { useEffect, useState } from 'react';
import { getUpcomingFollowUps } from '@/app/actions/communications';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { $Enums } from '@prisma/client';

// Define the FollowUp type based on the Prisma query structure
type FollowUp = {
    id: string;
    patientId: string;
    testId: string;
    method: $Enums.CommunicationMethod;
    outcome: $Enums.CommunicationOutcome;
    followUpDate: Date | null;
    updatedAt: Date;
    patient: {
        firstName: string;
        lastName: string;
    };
};

export function UpcomingFollowUps() {
    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFollowUps = async () => {
            const result = await getUpcomingFollowUps();
            if ('error' in result) {
                setError(result.error || null);
            } else {
                setFollowUps(result.followUps);
            }
        };
        fetchFollowUps();

        // Set up an interval to fetch follow-ups every 5 minutes
        const intervalId = setInterval(fetchFollowUps, 5 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Upcoming Follow-ups</h2>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Follow-up Date</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {followUps.map((followUp) => (
                        <TableRow key={followUp.id}>
                            <TableCell>{`${followUp.patient.firstName} ${followUp.patient.lastName}`}</TableCell>
                            <TableCell>{followUp.followUpDate ? new Date(followUp.followUpDate).toLocaleString() : 'N/A'}</TableCell>
                            <TableCell>{followUp.method}</TableCell>
                            <TableCell>
                                <Button variant="outline" onClick={() => { /* Handle follow-up action */ }}>
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

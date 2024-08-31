import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CommunicationMethod, CommunicationOutcome } from '@prisma/client';

interface FollowUp {
    id: string;
    method: CommunicationMethod;
    outcome: CommunicationOutcome;
    notes?: string;
    followUpDate: Date | null;
    createdAt: Date;
}

interface FollowUpListProps {
    followUps: FollowUp[];
}

export function FollowUpList({ followUps }: FollowUpListProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Notes</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {followUps.map((followUp) => (
                    <TableRow key={followUp.id}>
                        <TableCell>{followUp.followUpDate?.toLocaleDateString() || 'N/A'}</TableCell>
                        <TableCell>{followUp.method}</TableCell>
                        <TableCell>{followUp.notes || 'N/A'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
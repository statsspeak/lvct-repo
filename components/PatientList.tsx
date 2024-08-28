import React from 'react';
import Link from 'next/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TestStatus } from '@prisma/client';

interface PatientListProps {
    patients: Array<{
        id: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        email: string | null;
        phone: string | null;
        tests: Array<{
            id: string;
            status: TestStatus;
            completedAt: Date | null;
        }>;
    }>;
}

export function PatientList({ patients }: PatientListProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Test Status</TableHead>
                    <TableHead>Test Completed Date</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {patients.map((patient) => (
                    <TableRow key={patient.id}>
                        <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                        <TableCell>{new Date(patient.dateOfBirth).toLocaleDateString()}</TableCell>
                        <TableCell>{patient.email || patient.phone || 'N/A'}</TableCell>
                        <TableCell>{patient.tests[0]?.status || 'No test'}</TableCell>
                        <TableCell>{patient.tests[0]?.completedAt?.toLocaleDateString() || 'N/A'}</TableCell>
                        <TableCell>
                            <Link href={`/dashboard/communications/${patient.id}`}>
                                <Button variant="outline">View Details</Button>
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
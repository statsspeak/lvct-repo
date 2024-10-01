'use client';

import React, { useEffect, useState } from 'react';
import { getPatientsWithTests } from '@/app/actions/communications';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from '@/components/Pagination';
import { useSearchParams } from 'next/navigation';
import { TestStatus } from '@prisma/client';

interface Patient {
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
}

interface PaginationData {
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

export default function CommunicationsPage() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({ currentPage: 1, totalPages: 1, totalCount: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') as TestStatus | undefined;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await getPatientsWithTests(page, 10, status, search);
            if ('error' in result) {
                setError(result.error || null);
            } else {
                setPatients(result.patients);
                setPagination(result.pagination);
            }
            setLoading(false);
        };

        fetchData();
    }, [page, search, status]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Patient Communications</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Latest Test Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patients.map((patient) => (
                        <TableRow key={patient.id}>
                            <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                            <TableCell>{patient.tests[0]?.status || 'No tests'}</TableCell>
                            <TableCell>
                                <Link href={`/dashboard/call-center-agent/communications/${patient.id}`}>
                                    <Button variant="outline">View Communications</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalCount={pagination.totalCount}
            />
        </div>
    );
}
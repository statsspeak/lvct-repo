'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/select';
import { TestStatus } from '@prisma/client';

interface TestStatusFilterProps {
    currentStatus?: TestStatus;
}

export function TestStatusFilter({ currentStatus }: TestStatusFilterProps) {
    const router = useRouter();

    const handleStatusChange = (status: string) => {
        const params = new URLSearchParams(window.location.search);
        if (status) {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <Select
            value={currentStatus || ''}
            onValueChange={handleStatusChange}
        >
            <option value="">All Statuses</option>
            {Object.values(TestStatus).map((status) => (
                <option key={status} value={status}>
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
            ))}
        </Select>
    );
}
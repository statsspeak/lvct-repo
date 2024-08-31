'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
}

export function Pagination({ currentPage, totalPages, totalCount }: PaginationProps) {
    const router = useRouter();

    const handlePageChange = (newPage: number) => {
        router.push(`?page=${newPage}`);
    };

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages} (Total items: {totalCount})
            </p>
            <div className="space-x-2">
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
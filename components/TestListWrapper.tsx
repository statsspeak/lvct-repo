'use client';

import React from 'react';
import { TestList } from './TestList';
import { useRouter } from 'next/navigation';
import { Test, TestStatus } from '@prisma/client';

interface TestListWrapperProps {
  initialTests: (Test & { patient: { firstName: string; lastName: string } })[];
  updateTestStatus: (formData: FormData) => Promise<{ success: boolean } | { error: string }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

export function TestListWrapper({ initialTests, updateTestStatus, pagination }: TestListWrapperProps) {
  const router = useRouter();

  const handleSearch = (term: string) => {
    router.push(`/dashboard/lab?search=${encodeURIComponent(term)}`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/lab?page=${newPage}`);
  };

  return (
    <TestList
      initialTests={initialTests}
      updateTestStatus={updateTestStatus}
      pagination={pagination}
      onSearch={handleSearch}
      onPageChange={handlePageChange}
    />
  );
}
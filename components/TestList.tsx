"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Test, TestStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "@/components/ConfirmationDialog";
import { ErrorMessage } from "@/components/ErrorMessage";
import Link from "next/link";

interface TestWithPatient extends Test {
  patient: { firstName: string; lastName: string };
}

interface TestListProps {
  initialTests: TestWithPatient[];
  updateTestStatus: (
    formData: FormData
  ) => Promise<{ success: boolean } | { error: string }>;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
  onSearch: (term: string) => void;
  onPageChange: (page: number) => void;
}

export const TestList = React.memo(function TestList({
  initialTests,
  updateTestStatus,
  pagination,
  onSearch,
  onPageChange,
}: TestListProps) {
  const [tests, setTests] = useState(initialTests);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    testId: string;
    newStatus: TestStatus;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStatusChange = useCallback(
    (testId: string, newStatus: TestStatus) => {
      setConfirmDialog({ isOpen: true, testId, newStatus });
    },
    []
  );

  const confirmStatusChange = useCallback(async () => {
    if (confirmDialog) {
      const { testId, newStatus } = confirmDialog;
      const formData = new FormData();
      formData.append("testId", testId);
      formData.append("status", newStatus);

      const result = await updateTestStatus(formData);
      if ("error" in result) {
        setError(result.error);
      } else {
        setTests((prevTests) =>
          prevTests.map((test) =>
            test.id === testId ? { ...test, status: newStatus } : test
          )
        );
      }
      setConfirmDialog(null);
    }
  }, [confirmDialog, updateTestStatus]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(searchTerm);
    },
    [searchTerm, onSearch]
  );

  const sortedTests = useMemo(
    () =>
      [...tests].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [tests]
  );

  return (
    <div>
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="Search by patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Collection Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTests.map((test) => (
            <TableRow key={test.id}>
              <TableCell>{`${test.patient.firstName} ${test.patient.lastName}`}</TableCell>
              <TableCell>{test.status}</TableCell>
              <TableCell>
                {new Date(test.collectionDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link href={`/dashboard/lab-technician/update-test/${test.id}`}>
                  <Button variant="outline">Update Status</Button>
                </Link>
                <Button
                  variant="outline"
                  className="ml-2"
                  onClick={() => router.push(`/dashboard/lab-technician/tests/${test.id}`)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-between items-center">
        <div>
          Showing {tests.length} of {pagination.totalCount} tests
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {confirmDialog && (
        <ConfirmationDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog(null)}
          onConfirm={confirmStatusChange}
          title="Confirm Status Change"
          description={`Are you sure you want to change the status to ${confirmDialog.newStatus}?`}
        />
      )}
    </div>
  );
});

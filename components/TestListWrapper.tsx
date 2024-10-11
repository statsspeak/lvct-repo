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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Search, ChevronLeft, ChevronRight, Edit, Eye } from "lucide-react";
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

export function TestListWrapper({
  initialTests,
  updateTestStatus,
  pagination,
}: TestListProps) {
  const router = useRouter();

  const handleSearch = (term: string) => {
    router.push(
      `/dashboard/lab-technician/tests?search=${encodeURIComponent(term)}`
    );
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/dashboard/lab-technician/tests?page=${newPage}`);
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
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleStatusChange = useCallback(
    (testId: string, newStatus: TestStatus) => {
      setConfirmDialog({ isOpen: true, testId, newStatus });
    },
    []
  );

  const confirmStatusChange = useCallback(async () => {
    if (confirmDialog) {
      const { testId, newStatus } = confirmDialog;
      setLoading(true);
      const formData = new FormData();
      formData.append("testId", testId);
      formData.append("status", newStatus);

      try {
        const result = await updateTestStatus(formData);
        if ("error" in result) {
          throw new Error(result.error);
        }
        setTests((prevTests) =>
          prevTests.map((test) =>
            test.id === testId ? { ...test, status: newStatus } : test
          )
        );
        toast({
          title: "Status Updated",
          description: `Test status has been updated to ${newStatus}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setConfirmDialog(null);
      }
    }
  }, [confirmDialog, updateTestStatus, toast]);

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

  const getStatusBadge = (status: TestStatus) => {
    switch (status) {
      case "RECEIVED":
        return <Badge variant="secondary">Received</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="warning">In Progress</Badge>;
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="overflow-x-auto">
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
                  <TableCell>{getStatusBadge(test.status)}</TableCell>
                  <TableCell>
                    {new Date(test.collectionDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/dashboard/lab-technician/update-test/${test.id}`
                          )
                        }
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(
                            `/dashboard/lab-technician/tests/${test.id}`
                          )
                        }
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            Showing {tests.length} of {pagination.totalCount} tests
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              size="sm"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
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

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Spinner />
          </div>
        )}
      </CardContent>
    </Card>
  );
});

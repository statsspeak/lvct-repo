"use client";

import React, { useEffect, useState } from "react";
import { getPatientsWithTests } from "@/app/actions/communications";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/Pagination";
import { useSearchParams } from "next/navigation";
import { TestStatus } from "@prisma/client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";

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
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TestStatus | "ALL">("ALL");

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getPatientsWithTests(
        page,
        10,
        status === "ALL" ? undefined : status,
        search
      );
      if ("error" in result) {
        setError(result.error || null);
      } else {
        setPatients(result.patients);
        setPagination(result.pagination);
      }
      setLoading(false);
    };

    fetchData();
  }, [page, search, status]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-lvct-purple">
          Patient Communications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm border-lvct-purple focus:ring-lvct-red"
          />
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as TestStatus | "ALL")}
          >
            <SelectTrigger className="w-[180px] border-lvct-purple">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              {Object.values(TestStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-lvct-purple text-white">
              <TableHead>Patient Name</TableHead>
              <TableHead>Latest Test Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                <TableCell>{patient.tests[0]?.status || "No tests"}</TableCell>
                <TableCell>
                  <Button
                    asChild
                    variant="outline"
                    className="border-lvct-red hover:bg-lvct-red hover:text-white"
                  >
                    <Link
                      href={`/dashboard/call-center-agent/communications/${patient.id}`}
                    >
                      View Communications
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalCount={pagination.totalCount}
          />
        </div>
      </CardContent>
    </Card>
  );
}

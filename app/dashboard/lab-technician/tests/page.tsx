"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TestListWrapper } from "@/components/TestListWrapper";
import { getTests, updateTestStatus } from "@/app/actions/tests";
import { Test, TestStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { Search, Filter } from "lucide-react";

type TestWithPatient = Test & {
  patient: { firstName: string; lastName: string };
};

export default function ManageTestsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [tests, setTests] = useState<TestWithPatient[]>([]);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalCount: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "ALL");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const result = await getTests(
          status === "ALL" ? undefined : (status as TestStatus),
          page,
          10,
          search
        );
        if ("error" in result) {
          throw new Error(result.error);
        }
        setTests(result.tests);
        setPagination(result.pagination);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch tests. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, [status, page, search, toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateSearchParams();
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
    updateSearchParams();
  };

  const updateSearchParams = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status && status !== "ALL") params.set("status", status);
    if (page > 1) params.set("page", page.toString());
    router.push(`/dashboard/lab-technician/tests?${params.toString()}`);
  };

  const handleTestListSearch = (term: string) => {
    setSearch(term);
    setPage(1);
    updateSearchParams();
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Manage Tests</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex space-x-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search tests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="w-48">
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="RECEIVED">Received</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">
              <Filter className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
          </form>
        </CardContent>
      </Card>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <TestListWrapper
          initialTests={tests}
          updateTestStatus={updateTestStatus}
          pagination={pagination!}
          onPageChange={(newPage) => {
            setPage(newPage);
            updateSearchParams();
          }}
          onSearch={handleTestListSearch}
        />
      )}
    </div>
  );
}

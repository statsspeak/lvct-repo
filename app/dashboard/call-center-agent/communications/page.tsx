"use client"

import React, { useEffect, useState, useCallback } from "react"
import { getPatientsWithTests } from "@/app/actions/communications"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pagination } from "@/components/Pagination"
import { useRouter, useSearchParams } from "next/navigation"
import { TestStatus } from "@prisma/client"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from 'use-debounce'
import { Search, Filter, Eye, AlertCircle } from "lucide-react"

interface Patient {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: Date
  email: string | null
  phone: string | null
  tests: Array<{
    id: string
    status: TestStatus
    completedAt: Date | null
  }>
}

interface PaginationData {
  currentPage: number
  totalPages: number
  totalCount: number
}

export default function CommunicationsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<TestStatus | "ALL">("ALL")

  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get("page")) || 1
  const [debouncedSearch] = useDebounce(search, 300)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getPatientsWithTests(
        page,
        10,
        status === "ALL" ? undefined : status,
        debouncedSearch
      )
      if ("error" in result) {
        throw new Error(result.error)
      }
      setPatients(result.patients)
      setPagination(result.pagination)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An error occurred while fetching data")
      }
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, status])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handlePageChange = useCallback((newPage: number) => {
    router.push(`/dashboard/call-center-agent/communications?page=${newPage}`)
  }, [router])

  const getStatusBadge = useCallback((status: TestStatus) => {
    switch (status) {
      case "RECEIVED":
        return <Badge variant="secondary">Received</Badge>
      case "IN_PROGRESS":
        return <Badge variant="warning">In Progress</Badge>
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }, [])

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Patient Communications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as TestStatus | "ALL")}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
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

        {loading && (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
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
                      <TableCell className="font-medium">{`${patient.firstName} ${patient.lastName}`}</TableCell>
                      <TableCell>
                        {patient.tests[0]
                          ? getStatusBadge(patient.tests[0].status)
                          : "No tests"}
                      </TableCell>
                      <TableCell>
                        <Button asChild variant="outline" size="sm">
                          <Link
                            href={`/dashboard/call-center-agent/communications/${patient.id}`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Communications
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Showing {patients.length} of {pagination.totalCount} patients
              </p>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
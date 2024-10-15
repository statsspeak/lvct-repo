"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pagination } from "@/components/Pagination";
import { TestStatus } from "@prisma/client";
import { Calendar, Search, User, FileText, AlertTriangle } from "lucide-react";
import { FollowUp } from "@/app/types/followUp";
import Link from "next/link";

interface FollowUpListProps {
  followUps: FollowUp[];
}

export function FollowUpList({ followUps }: FollowUpListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const filteredFollowUps = followUps.filter(
    (followUp) =>
      followUp.patient.firstName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      followUp.patient.lastName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      followUp.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFollowUps.length / itemsPerPage);
  const paginatedFollowUps = filteredFollowUps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: TestStatus) => {
    switch (status) {
      case "RECEIVED":
        return <Badge variant="secondary">Received</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="warning">In Progress</Badge>;
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>;
      case "COMMUNICATED":
        return <Badge variant="primary">Communicated</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Follow-ups</CardTitle>
        <div className="flex items-center space-x-2">
          <Search className="text-muted-foreground" />
          <Input
            placeholder="Search by patient name or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Calendar className="mr-2 inline-block" />
                  Date
                </TableHead>
                <TableHead>
                  <User className="mr-2 inline-block" />
                  Patient
                </TableHead>
                <TableHead>
                  <AlertTriangle className="mr-2 inline-block" />
                  Test Status
                </TableHead>
                <TableHead>
                  <FileText className="mr-2 inline-block" />
                  Notes
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFollowUps.map((followUp) => (
                <TableRow key={followUp.id}>
                  <TableCell>
                    {new Date(followUp.followUpDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{`${followUp.patient.firstName} ${followUp.patient.lastName}`}</TableCell>
                  <TableCell>{getStatusBadge(followUp.test.status)}</TableCell>
                  <TableCell>{followUp.notes || "N/A"}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Link
                        href={`/dashboard/call-center-agent/follow-ups/${followUp.id}`}
                      >
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {paginatedFollowUps.length} of {filteredFollowUps.length}{" "}
          follow-ups
        </p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </CardFooter>
    </Card>
  );
}

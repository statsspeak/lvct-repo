import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CommunicationMethod,
  CommunicationOutcome,
  TestStatus,
} from "@prisma/client";

interface Communication {
  id: string;
  method: CommunicationMethod;
  outcome: CommunicationOutcome;
  notes?: string;
  followUpDate?: Date;
  createdAt: Date;
  communicatedByUser: {
    name: string;
  };
  test: {
    id: string;
    status: TestStatus;
  };
}

interface CommunicationListProps {
  communications: Communication[];
}

export function CommunicationList({ communications }: CommunicationListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Outcome</TableHead>
          <TableHead>Notes</TableHead>
          <TableHead>Follow-up Date</TableHead>
          <TableHead>Communicated By</TableHead>
          <TableHead>Test Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {communications.map((comm) => (
          <TableRow key={comm.id}>
            <TableCell>{new Date(comm.createdAt).toLocaleString()}</TableCell>
            <TableCell>{comm.method}</TableCell>
            <TableCell>{comm.outcome}</TableCell>
            <TableCell>{comm.notes || "N/A"}</TableCell>
            <TableCell>
              {comm.followUpDate
                ? new Date(comm.followUpDate).toLocaleDateString()
                : "N/A"}
            </TableCell>
            <TableCell>{comm.communicatedByUser.name}</TableCell>
            <TableCell>{comm.test.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

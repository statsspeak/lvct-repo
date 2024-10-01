import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FollowUp {
  id: string
  followUpDate: Date
  notes?: string
  patient: {
    firstName: string
    lastName: string
  }
  test: {
    status: string
  }
}

interface FollowUpListProps {
  followUps: FollowUp[]
}

export function FollowUpList({ followUps }: FollowUpListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Test Status</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {followUps.map((followUp) => (
          <TableRow key={followUp.id}>
            <TableCell>{new Date(followUp.followUpDate).toLocaleDateString()}</TableCell>
            <TableCell>{`${followUp.patient.firstName}  ${followUp.patient.lastName}`}</TableCell>
            <TableCell>{followUp.test.status}</TableCell>
            <TableCell>{followUp.notes?.toString() || 'N/A'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
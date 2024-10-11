import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, Activity, Eye } from "lucide-react";

async function getPatientHistory(id: string) {
  const session = await auth();
  if (!session || (session.user as any).role !== "LAB_TECHNICIAN") {
    throw new Error("Unauthorized");
  }

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      tests: {
        orderBy: { createdAt: "desc" },
        include: { createdByUser: true },
      },
    },
  });

  if (!patient) {
    notFound();
  }

  return patient;
}

export default async function PatientHistoryPage({
  params,
}: {
  params: { id: string };
}) {
  const patient = await getPatientHistory(params.id);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Test History</h1>
        <Link href="/dashboard/lab-technician">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <dt className="font-semibold mr-2">Name:</dt>
              <dd>
                {patient.firstName} {patient.lastName}
              </dd>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <dt className="font-semibold mr-2">Date of Birth:</dt>
              <dd>{new Date(patient.dateOfBirth).toLocaleDateString()}</dd>
            </div>
            <div className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              <dt className="font-semibold mr-2">HIV Status:</dt>
              <dd>
                <Badge
                  variant={
                    patient.hivStatus === "POSITIVE" ? "destructive" : "success"
                  }
                >
                  {patient.hivStatus}
                </Badge>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Test History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Conducted By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patient.tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell>
                      {new Date(test.collectionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          test.status === "COMPLETED"
                            ? "success"
                            : test.status === "IN_PROGRESS"
                            ? "warning"
                            : "default"
                        }
                      >
                        {test.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{test.result || "Pending"}</TableCell>
                    <TableCell>{test.createdByUser.name}</TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/lab-technician/update-test/${test.id}`}
                      >
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" /> View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

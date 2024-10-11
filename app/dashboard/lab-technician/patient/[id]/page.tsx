import React from "react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Activity,
  Plus,
  History,
} from "lucide-react";

async function getPatient(id: string) {
  const session = await auth();
  if (!session || (session.user as any).role !== "LAB_TECHNICIAN") {
    throw new Error("Unauthorized");
  }

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      tests: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { createdByUser: true },
      },
    },
  });

  if (!patient) {
    notFound();
  }

  return patient;
}

export default async function PatientProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const patient = await getPatient(params.id);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Patient Profile</h1>
        <Link href="/dashboard/lab-technician">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList>
          <TabsTrigger value="info">Patient Information</TabsTrigger>
          <TabsTrigger value="tests">Recent Tests</TabsTrigger>
        </TabsList>
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Mail className="mr-2 h-4 w-4" />
                  <dt className="font-semibold mr-2">Email:</dt>
                  <dd>{patient.email || "N/A"}</dd>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  <dt className="font-semibold mr-2">Phone:</dt>
                  <dd>{patient.phone || "N/A"}</dd>
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  <dt className="font-semibold mr-2">Address:</dt>
                  <dd>{patient.address}</dd>
                </div>
                <div className="flex items-center">
                  <Activity className="mr-2 h-4 w-4" />
                  <dt className="font-semibold mr-2">HIV Status:</dt>
                  <dd>
                    <Badge
                      variant={
                        patient.hivStatus === "POSITIVE"
                          ? "destructive"
                          : "success"
                      }
                    >
                      {patient.hivStatus}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Recent Tests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.tests.length > 0 ? (
                <ul className="space-y-4">
                  {patient.tests.map((test) => (
                    <li key={test.id} className="border-b pb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">
                            Date:{" "}
                            {new Date(test.collectionDate).toLocaleDateString()}
                          </p>
                          <p>
                            Status: <Badge>{test.status}</Badge>
                          </p>
                          <p>Result: {test.result || "Pending"}</p>
                          <p className="text-sm text-muted-foreground">
                            Conducted by: {test.createdByUser.name}
                          </p>
                        </div>
                        <Link
                          href={`/dashboard/lab-technician/update-test/${test.id}`}
                        >
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No recent tests found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Link
          href={`/dashboard/lab-technician/record-test?patientId=${patient.id}`}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Record New Test
          </Button>
        </Link>
        <Link href={`/dashboard/lab-technician/patient-history/${patient.id}`}>
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" /> View Full Test History
          </Button>
        </Link>
      </div>
    </div>
  );
}

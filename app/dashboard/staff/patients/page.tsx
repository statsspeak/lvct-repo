import { getPatients } from "@/app/actions/patients";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchPatients } from "@/components/SearchPatients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// Import the skeleton if you need it in this file
import { PatientsSkeleton } from '@/components/PatientsSkeleton';

export default async function Patients({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const { patients, error } = await getPatients(searchParams.search);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-lvct-purple">
          Registered Patients
        </CardTitle>
        <Button asChild>
          <Link href="/dashboard/staff/register-patient">
            <Plus className="mr-2 h-4 w-4" /> Register New Patient
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <SearchPatients />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients?.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{`${patient.firstName} ${patient.lastName}`}</TableCell>
                  <TableCell>
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{patient.email || "N/A"}</TableCell>
                  <TableCell>{patient.phone || "N/A"}</TableCell>
                  <TableCell>
                    <Button asChild variant="outline">
                      <Link href={`/dashboard/staff/patients/${patient.id}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}


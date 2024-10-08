import React from "react";
import { getPatient } from "@/app/actions/patients";
import { PatientForm } from "@/components/PatientForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PatientDetailsForm } from "@/components/PatientDetailsForm";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  email?: string | null;
  phone?: string | null;
  consentForm?: string | null;
  qrCode?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default async function PatientPage({
  params,
}: {
  params: { id: string };
}) {
  const { patient, error } = await getPatient(params.id);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!patient) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>Patient not found</AlertDescription>
      </Alert>
    );
  }

  // Transform null values to undefined and ensure dateOfBirth is a Date object
  const transformedPatient = {
    ...patient,
    email: patient.email ?? undefined,
    phone: patient.phone ?? undefined,
    dateOfBirth:
      patient.dateOfBirth instanceof Date
        ? patient.dateOfBirth
        : new Date(patient.dateOfBirth),
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-lvct-purple">
          Patient Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PatientDetailsForm patient={transformedPatient} />
      </CardContent>
    </Card>
  );
}
export function PatientPageSkeleton() {
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}

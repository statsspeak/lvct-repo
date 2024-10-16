import React from "react";
import { getPatient } from "@/app/actions/patients";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PatientDetailsForm } from "@/components/PatientDetailsForm";
import Image from "next/image";
// Import the skeleton if you need it in this file
// import { PatientPageSkeleton } from '@/components/PatientPageSkeleton';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  email?: string | null;
  phone?: string | null;
  address: string;
  hivStatus: "POSITIVE" | "NEGATIVE" | "UNKNOWN";
  medicalHistory?: string | null;
  riskFactors?: string | null;
  consentForm?: string | null;
  consentName: string;
  consentDate: string | Date;
  qrCode: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TransformedPatient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email?: string;
  phone?: string;
  address: string;
  hivStatus: "POSITIVE" | "NEGATIVE" | "UNKNOWN";
  medicalHistory?: string;
  riskFactors?: string;
  consentName: string;
  consentDate: Date;
  qrCode: string;
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

  // Transform null values to undefined and ensure dateOfBirth and consentDate are Date objects
  const transformedPatient: TransformedPatient = {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    dateOfBirth: new Date(patient.dateOfBirth),
    email: patient.email || undefined,
    phone: patient.phone || undefined,
    address: patient.address,
    hivStatus: patient.hivStatus,
    medicalHistory: patient.medicalHistory || undefined,
    riskFactors: patient.riskFactors || undefined,
    consentName: patient.consentName,
    consentDate: new Date(patient.consentDate),
    qrCode: patient.qrCode,
  };

  return (
    <div className="space-y-6">
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

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-lvct-purple">
            Patient QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Image
            src={transformedPatient.qrCode}
            alt="Patient QR Code"
            width={200}
            height={200}
            className="border-4 border-lvct-purple rounded-lg"
          />
        </CardContent>
      </Card>
    </div>
  );
}

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string | null;
  phone: string | null;
}

interface PatientDetailsProps {
  patient: Patient;
}

export function PatientDetails({ patient }: PatientDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900">{`${patient.firstName} ${patient.lastName}`}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(patient.dateOfBirth).toLocaleDateString()}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {patient.email || "N/A"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {patient.phone || "N/A"}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}

import React from "react";
import {
  getPatientCommunications,
  getPatientDetails,
} from "@/app/actions/communications";
import { CommunicationList } from "@/components/CommunicationList";
import { CommunicationForm } from "@/components/CommunicationForm";
import { PatientDetails } from "@/components/PatientDetails";
import { FollowUpList } from "@/components/FollowUpList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FollowUp } from "@/app/types/followUp";

export default async function PatientCommunicationPage({
  params,
}: {
  params: { patientId: string };
}) {
  const [communicationsResult, patientDetailsResult] = await Promise.all([
    getPatientCommunications(params.patientId),
    getPatientDetails(params.patientId),
  ]);

  if ("error" in communicationsResult || "error" in patientDetailsResult) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {communicationsResult.error || patientDetailsResult.error}
        </AlertDescription>
      </Alert>
    );
  }

  const { communications } = communicationsResult;
  const { patient } = patientDetailsResult;

  const followUps: FollowUp[] = communications
    .filter(
      (comm): comm is typeof comm & { followUpDate: string } =>
        comm.followUpDate !== null && new Date(comm.followUpDate) > new Date()
    )
    .map((comm) => ({
      patient: { firstName: patient.firstName, lastName: patient.lastName },
      test: { id: comm.test.id, status: comm.test.status },
      outcome: comm.outcome,
      id: comm.id,
      patientId: params.patientId,
      followUpDate: new Date(comm.followUpDate),
      method: comm.method,
      notes: comm.notes || null,
      communicatedByUser: {
        name: comm.communicatedByUser?.name || null,
      },
      createdAt: new Date(comm.createdAt),
    }));

  const safeCommunciations = communications.map((comm) => ({
    ...comm,
    communicatedByUser: {
      ...comm.communicatedByUser,
      name: comm.communicatedByUser?.name || "",
    },
    followUpDate: comm.followUpDate || undefined,
  }));

  const latestTest = patient.tests[0];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Patient Communications</h1>
      <PatientDetails patient={patient} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Record New Communication</CardTitle>
          </CardHeader>
          <CardContent>
            {latestTest ? (
              <CommunicationForm
                patientId={params.patientId}
                testId={latestTest.id}
              />
            ) : (
              <Alert>
                <AlertTitle>No Test Available</AlertTitle>
                <AlertDescription>
                  There are no tests associated with this patient. A test is
                  required to record a communication.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Follow-ups</CardTitle>
          </CardHeader>
          <CardContent>
            <FollowUpList followUps={followUps} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <CommunicationList communications={safeCommunciations} />
        </CardContent>
      </Card>
    </div>
  );
}

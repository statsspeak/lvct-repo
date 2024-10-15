import {
  TestStatus,
  CommunicationMethod,
  CommunicationOutcome,
} from "@prisma/client";

export interface FollowUp {
  id: string;
  patient: { firstName: string; lastName: string };
  test: { id: string; status: TestStatus };
  outcome: CommunicationOutcome;
  patientId: string;
  followUpDate: Date;
  method: CommunicationMethod;
  notes: string | null;
  communicatedByUser: { name: string | null };
  createdAt: Date;
}

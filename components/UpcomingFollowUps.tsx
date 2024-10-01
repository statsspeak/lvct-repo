"use client";

import React, { useEffect, useState } from "react";
import { getUpcomingFollowUps } from "@/app/actions/communications";
import { FollowUpList } from "./FollowUpList";
import { CommunicationMethod, CommunicationOutcome, TestStatus } from "@prisma/client";

export function UpcomingFollowUps() {
  const [followUps, setFollowUps] = useState<
    Array<{
      patient: { firstName: string; lastName: string };
      test: { status: TestStatus };
      outcome: CommunicationOutcome;
      id: string;
      patientId: string;
      testId: string;
      updatedAt: Date;
      followUpDate: Date;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowUps = async () => {
      const result = await getUpcomingFollowUps();
      if ("error" in result) {
        setError(result.error || null);
      } else {
        setFollowUps(result.followUps.filter((followUp): followUp is {
          patient: { firstName: string; lastName: string };
          test: { status: TestStatus };
          outcome: CommunicationOutcome;
          id: string;
          patientId: string;
          testId: string;
          updatedAt: Date;
          followUpDate: Date;
          method: CommunicationMethod;
          notes: string | null;
          communicatedBy: string;
          createdAt: Date;
        } => followUp.followUpDate !== null).map(followUp => ({
          patient: followUp.patient,
          test: followUp.test,
          outcome: followUp.outcome,
          id: followUp.id,
          patientId: followUp.patientId,
          testId: followUp.testId,
          updatedAt: followUp.updatedAt,
          followUpDate: followUp.followUpDate as Date,
        })));
      }
    };
    fetchFollowUps();
  }, []);
  if (error) return <div>Error: {error}</div>;
  if (followUps.length === 0) return <div>No upcoming follow-ups</div>;

  return <FollowUpList followUps={followUps} />;
}
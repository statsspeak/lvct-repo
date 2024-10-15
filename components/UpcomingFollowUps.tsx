"use client";
import React, { useEffect, useState, useCallback } from "react";
import { getUpcomingFollowUps } from "@/app/actions/communications";
import { FollowUpList } from "./FollowUpList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { FollowUp } from "@/app/types/followUp";

export function UpcomingFollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFollowUps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUpcomingFollowUps();
      if ("error" in result) {
        throw new Error(result.error);
      }
      setFollowUps(
        result.followUps
          .filter((followUp) => followUp.followUpDate !== null)
          .map(
            (followUp): FollowUp => ({
              id: followUp.id,
              patient: {
                firstName: followUp.patient.firstName,
                lastName: followUp.patient.lastName,
              },
              test: {
                id: followUp.testId,
                status: followUp.test.status,
              },
              outcome: followUp.outcome,
              patientId: followUp.patientId,
              followUpDate: new Date(followUp.followUpDate!),
              method: followUp.method,
              notes: followUp.notes,
              communicatedByUser: {
                name: followUp.communicatedBy || null,
              },
              createdAt: new Date(followUp.createdAt),
            })
          )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching follow-ups"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button
          onClick={fetchFollowUps}
          variant="outline"
          size="sm"
          className="mt-2"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </Alert>
    );
  }

  if (followUps.length === 0) {
    return (
      <Alert>
        <AlertTitle>No upcoming follow-ups</AlertTitle>
        <AlertDescription>
          There are currently no scheduled follow-ups.
        </AlertDescription>
      </Alert>
    );
  }

  return <FollowUpList followUps={followUps} />;
}

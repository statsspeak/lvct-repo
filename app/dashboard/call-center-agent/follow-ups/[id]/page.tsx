import React from "react";
import { getFollowUpDetails } from "@/app/actions/communications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FollowUp } from "@/app/types/followUp";

export default async function FollowUpDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getFollowUpDetails(params.id);

  if (result === null) {
    return <div>Follow-up not found</div>;
  }

  if ("error" in result) {
    return <div>Error: {result.error}</div>;
  }

  const followUpDetails: FollowUp = result;

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/dashboard/call-center-agent/follow-ups">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Follow-ups
        </Link>
      </Button>

      <h1 className="text-3xl font-bold">Follow-up Details</h1>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {followUpDetails.patient.firstName}{" "}
            {followUpDetails.patient.lastName}
          </p>
          <p>
            <strong>Follow-up Date:</strong>{" "}
            {new Date(followUpDetails.followUpDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Test Status:</strong>{" "}
            <Badge>{followUpDetails.test.status}</Badge>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Method:</strong> {followUpDetails.method}
          </p>
          <p>
            <strong>Outcome:</strong> {followUpDetails.outcome}
          </p>
          <p>
            <strong>Notes:</strong> {followUpDetails.notes || "N/A"}
          </p>
          <p>
            <strong>Communicated By:</strong>{" "}
            {followUpDetails.communicatedByUser.name || "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

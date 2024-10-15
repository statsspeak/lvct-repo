import React from "react";
import { getFollowUpDetails } from "@/app/actions/communications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Clipboard,
  PhoneCall,
  FileText,
} from "lucide-react";
import { FollowUp } from "@/app/types/followUp";

export default async function FollowUpDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getFollowUpDetails(params.id);

  if (result === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-center text-destructive">
              Follow-up not found
            </h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  if ("error" in result) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-center text-destructive">
              Error: {result.error}
            </h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  const followUpDetails: FollowUp = result;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/dashboard/call-center-agent/follow-ups">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Follow-ups
        </Link>
      </Button>

      <h1 className="text-4xl font-bold mb-8 text-primary">
        Follow-up Details
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader className="bg-muted">
            <CardTitle className="flex items-center text-2xl">
              <User className="mr-2 h-6 w-6" /> Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">
                  {followUpDetails.patient.firstName}{" "}
                  {followUpDetails.patient.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Follow-up Date</p>
                <p className="font-medium">
                  {new Date(followUpDetails.followUpDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Test Status</p>
                <Badge
                  variant={
                    followUpDetails.test.status === "COMPLETED"
                      ? "success"
                      : "warning"
                  }
                >
                  {followUpDetails.test.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted">
            <CardTitle className="flex items-center text-2xl">
              <PhoneCall className="mr-2 h-6 w-6" /> Communication Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Method</p>
                <p className="font-medium">{followUpDetails.method}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Outcome</p>
                <p className="font-medium">{followUpDetails.outcome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Communicated By</p>
                <p className="font-medium">
                  {followUpDetails.communicatedByUser.name || "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-muted">
            <CardTitle className="flex items-center text-2xl">
              <FileText className="mr-2 h-6 w-6" /> Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="whitespace-pre-wrap">
              {followUpDetails.notes || "No notes available."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

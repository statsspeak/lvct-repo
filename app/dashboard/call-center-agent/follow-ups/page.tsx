import { Suspense } from "react";
import { UpcomingFollowUps } from "@/components/UpcomingFollowUps";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Calendar } from "lucide-react";

export const metadata = {
  title: "Follow-ups | Call Center Agent Dashboard",
  description: "Manage and view upcoming follow-ups for patients",
};

export default async function FollowUpsPage() {
  const session = await auth();
  if (!session || (session.user as any).role !== "CALL_CENTER_AGENT") {
    redirect("/unauthorized");
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary flex items-center">
          <Calendar className="mr-2 h-8 w-8" />
          Upcoming Follow-ups
        </h1>
        <Button asChild variant="outline">
          <Link href="/dashboard/call-center-agent/communications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Communications
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Follow-ups Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-64">
                <Spinner size="lg" />
              </div>
            }
          >
            <UpcomingFollowUps />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

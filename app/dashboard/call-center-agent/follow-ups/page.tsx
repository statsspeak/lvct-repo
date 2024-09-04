import { Suspense } from 'react';
import { UpcomingFollowUps } from '@/components/UpcomingFollowUps';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const metadata = {
    title: 'Follow-ups | Call Center Agent Dashboard',
    description: 'Manage and view upcoming follow-ups for patients',
};

export default async function FollowUpsPage() {
    const session = await auth();
    if (!session || (session.user as any).role !== "CALL_CENTER_AGENT") {
        redirect('/unauthorized');
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Upcoming Follow-ups</h1>
                <Button asChild>
                    <Link href="/dashboard/call-center-agent/communications">Back to Communications</Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Follow-ups Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<LoadingSpinner />}>
                        <UpcomingFollowUps />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
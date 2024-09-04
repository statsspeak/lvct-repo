import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CallCenterAgentDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Call Center Agent Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Communications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Manage patient communications.</p>
                        <Button asChild>
                            <Link href="/dashboard/call-center-agent/communications">View Communications</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Follow-ups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Manage patient follow-ups.</p>
                        <Button asChild>
                            <Link href="/dashboard/call-center-agent/follow-ups">Manage Follow-ups</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Communication Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">View communication statistics.</p>
                        <Button asChild>
                            <Link href="/dashboard/call-center-agent/communications/stats">View Stats</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
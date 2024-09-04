import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LabTechnicianDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Lab Technician Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Manage Tests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">View and update test statuses.</p>
                        <Button asChild>
                            <Link href="/dashboard/lab-technician/tests">Manage Tests</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Record New Test</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Record a new test in the system.</p>
                        <Button asChild>
                            <Link href="/dashboard/lab-technician/record-test">Record Test</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Test Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">View test-related analytics.</p>
                        <Button asChild>
                            <Link href="/dashboard/lab-technician/analytics">View Analytics</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
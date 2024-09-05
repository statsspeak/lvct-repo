import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Manage system users and their roles.</p>
                        <Button asChild>
                            <Link href="/dashboard/admin/users">Manage Users</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Invite New User</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Invite new users to the system.</p>
                        <Button asChild>
                            <Link href="/dashboard/admin/invite-user">Invite User</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Audit Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">View system audit logs and activities.</p>
                        <Button asChild>
                            <Link href="/dashboard/admin/audit-logs">View Logs</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Access system-wide analytics and reports.</p>
                        <Button asChild>
                            <Link href="/dashboard/admin/analytics">View Analytics</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
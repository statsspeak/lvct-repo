import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart3, Users, UserPlus, FileText, LockIcon } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-lvct-purple">Admin Dashboard</h1>
        <Button
          asChild
          variant="outline"
          className="border-lvct-purple text-lvct-purple hover:bg-lvct-purple hover:text-white"
        >
          <Link href="/dashboard">Back to Main Dashboard</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminCard
          title="User Management"
          description="Manage system users and their roles."
          icon={<Users className="h-6 w-6 text-lvct-red" />}
          href="/dashboard/admin/users"
        />
        <AdminCard
          title="Invite New User"
          description="Invite new users to the system."
          icon={<UserPlus className="h-6 w-6 text-lvct-purple" />}
          href="/dashboard/admin/invite-user"
        />
        <AdminCard
          title="Audit Logs"
          description="View system audit logs and activities."
          icon={<FileText className="h-6 w-6 text-lvct-red" />}
          href="/dashboard/admin/audit-logs"
        />
        <AdminCard
          title="Analytics"
          description="Access system-wide analytics and reports."
          icon={<BarChart3 className="h-6 w-6 text-lvct-purple" />}
          href="/dashboard/admin/analytics"
        />
        <AdminCard
          title="Locked Accounts"
          description="Manage locked user accounts."
          icon={<LockIcon className="h-6 w-6 text-lvct-red" />}
          href="/dashboard/admin/locked-accounts"
        />
      </div>
    </div>
  );
}

function AdminCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-lvct-purple">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lvct-purple">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">{description}</p>
        <Button
          asChild
          className="w-full bg-lvct-red hover:bg-red-600 text-white"
        >
          <Link href={href}>Manage</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

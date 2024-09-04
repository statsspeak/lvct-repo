import { auth } from '@/auth';
import { StaffDashboardContent } from '@/components/StaffDashboardContent';

export default async function StaffDashboard() {
    const session = await auth();
    const userRole = (session?.user as any)?.role || '';

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Staff Dashboard</h1>
            <StaffDashboardContent userRole={userRole} />
        </div>
    );
}
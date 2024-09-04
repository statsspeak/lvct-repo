import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { DashboardNav } from "@/components/DashboardNav"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { NotificationBell } from "@/components/NotificationBell"

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <DashboardNav userRole={(session.user as any).role} />
            <main className="p-8">
                <div className="flex justify-between items-center mb-4">
                    <Breadcrumbs />
                    <NotificationBell />
                </div>
                <div className="mt-4">
                    {children}
                </div>
            </main>
        </div>
    )
}
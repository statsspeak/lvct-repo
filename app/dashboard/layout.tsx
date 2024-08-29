import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/auth"
import { SignOutButton } from "@/components/SignOutButton"
import { Button } from "@/components/ui/button"

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
        <div className="flex h-screen bg-gray-100">
            <nav className="w-64 bg-white p-4">
                <ul className="space-y-2">
                    <li>
                        <Link href="/dashboard" className="block py-2 px-4 hover:bg-gray-100 rounded">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link href="/dashboard/profile" className="block py-2 px-4 hover:bg-gray-100 rounded">
                            Profile
                        </Link>
                    </li>
                    {['STAFF'].includes((session.user as any).role) && (
                        <>
                            <li>
                                <Link href="/dashboard/register-patient" className="block py-2 px-4 hover:bg-gray-100 rounded">
                                    Register Patient
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/patients" className="block py-2 px-4 hover:bg-gray-100 rounded">
                                    Patients
                                </Link>
                            </li>
                        </>
                    )}
                    {['STAFF', 'LAB_TECHNICIAN'].includes((session.user as any).role) && (
                        <li>
                            <Link href="/dashboard/lab" className="block py-2 px-4 hover:bg-gray-100 rounded">
                                Lab
                            </Link>
                        </li>
                    )}
                    {(session.user as any).role === 'CALL_CENTER_AGENT' && (
                        <>
                            <li>
                                <Link href="/dashboard/communications" className="block py-2 px-4 hover:bg-gray-100 rounded">
                                    Communications
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/communications/stats" className="block py-2 px-4 hover:bg-gray-100 rounded">
                                    Stats
                                </Link>
                            </li>
                        </>

                    )}
                    {(session.user as any).role === 'ADMIN' && (
                        <>
                            <li>
                                <Link href="/dashboard/admin/audit-logs" className="block py-2 px-4 hover:bg-gray-100 rounded">
                                    Audit Logs
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/admin/locked-accounts" className="block py-2 px-4 hover:bg-gray-100 rounded">
                                    Locked Accounts
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/admin/invite-user" className="block py-2 px-4 hover:bg-gray-100 rounded">
                                    Invite User
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/admin/users" className="block py-2 px-4 hover:bg-gray-100 rounded">
                                    Manage Users
                                </Link>
                            </li>
                        </>
                    )}
                    <li className="mt-4">
                        <SignOutButton />
                    </li>
                </ul>
            </nav>
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}